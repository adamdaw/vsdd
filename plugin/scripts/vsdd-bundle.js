#!/usr/bin/env node
// vsdd-bundle <gate 1-4> [ITEM-NNN] — export the Adversary's admitted-only
// workspace (§A.17) and write its manifest.
//
// §A.17 requires the reviewer to operate on a bundle assembled from the ADMITTED
// paths only, exported into an isolated workspace that does not contain the
// withheld paths, with the manifest committed alongside the pass record so an
// auditor can confirm no withheld path entered the bundle.
//
// LIMIT, stated rather than papered over: this exports the workspace and proves
// the export excluded the withheld paths. It does NOT deny an AI reviewer's
// filesystem access — a subagent on this machine can read the repository around
// the bundle. Evidence isolation is therefore structural for a human reviewer
// and auditable for both, but honour-system for a tool-using AI reviewer.
// Zero dependencies — node only.

const fs = require("fs");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

// The §A.17 withheld classes, as paths. Override per project with
// state.json "evidence": {"withheld": [...], "admitted": [...]}.
const DEFAULT_WITHHELD = [
  ".vsdd/adr/",
  ".vsdd/sessions/",
  ".vsdd/research/",
  ".vsdd/HANDOFF.md",
];

function findStateFile(start) {
  let dir = start;
  for (;;) {
    const f = path.join(dir, ".vsdd", "state.json");
    if (fs.existsSync(f)) return f;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

// ponytail: prefix-or-exact path rules, not globs — §A.17 requires a rule the
// assembler applies "without judgement", and a trailing "/" meaning "this
// subtree" covers every withheld class the methodology names. If a project ever
// needs real globs, that is the upgrade.
function isWithheld(rel, rules) {
  const p = rel.replace(/\\/g, "/");
  return rules.some((r) =>
    r.endsWith("/") ? p === r.slice(0, -1) || p.startsWith(r) : p === r
  );
}

function walk(root, rel, out) {
  const abs = path.join(root, rel);
  const st = fs.statSync(abs);
  if (st.isDirectory()) {
    for (const e of fs.readdirSync(abs)) walk(root, path.join(rel, e), out);
  } else if (st.isFile()) {
    out.push(rel);
  }
}

function admittedFiles(root, specs, withheld) {
  const files = [];
  for (const spec of specs) {
    const rel = String(spec).replace(/\/+$/, "");
    if (!rel || !fs.existsSync(path.join(root, rel))) continue; // not authored yet
    const collected = [];
    walk(root, rel, collected);
    for (const f of collected) if (!isWithheld(f, withheld)) files.push(f);
  }
  return [...new Set(files)].sort();
}

function main() {
  const gate = Number(process.argv[2]);
  if (!Number.isInteger(gate) || gate < 1 || gate > 4) {
    console.error("usage: vsdd-bundle <gate 1-4> [ITEM-NNN]");
    console.error("Gate 5 is deterministic tooling, not an adversarial gate — it takes no bundle.");
    process.exit(1);
  }
  const itemId = process.argv[3] || null;

  const file = findStateFile(process.cwd());
  if (!file) {
    console.error("No .vsdd/state.json found. Run vsdd-init first.");
    process.exit(1);
  }
  const root = path.dirname(path.dirname(file));
  const state = JSON.parse(fs.readFileSync(file, "utf8"));
  const item = itemId ? (state.items || {})[itemId] : null;
  if (itemId && !item) {
    console.error(`Unknown work item "${itemId}".`);
    process.exit(1);
  }

  const ev = state.evidence || {};
  const withheld = Array.isArray(ev.withheld) ? ev.withheld : DEFAULT_WITHHELD;
  const at = (n) =>
    (item && item.artifacts && item.artifacts[n]) ||
    (state.artifacts && state.artifacts[n]) ||
    [];

  // Admitted: the standing governing set (Intent / SRS / Constitution), the
  // gate's source artifact, the derived artifact under review, plus whatever
  // objective evidence the project declares.
  const specs = [...at(1), ...at(gate - 1), ...at(gate), ...(ev.admitted || [])];
  const files = admittedFiles(root, specs, withheld);
  if (!files.length) {
    console.error(`No admitted artifacts found for Gate ${gate}${itemId ? ` / ${itemId}` : ""}.`);
    console.error(`Check .vsdd/state.json "artifacts" (and "evidence.admitted").`);
    process.exit(1);
  }

  const dest = fs.mkdtempSync(path.join(os.tmpdir(), `vsdd-bundle-g${gate}-`));
  for (const rel of files) {
    const to = path.join(dest, rel);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(path.join(root, rel), to);
  }

  // A control that can fail: re-walk the EXPORT and match what is actually in it
  // against the withheld rules. A bundle that cannot be shown to have excluded
  // the withheld paths is not valid evidence (§A.17, Principle 11) — so if the
  // assembly leaked, destroy the bundle rather than hand over a tainted one.
  const exported = [];
  walk(dest, "", exported);
  const leaked = exported.filter((f) => isWithheld(f, withheld));
  if (leaked.length) {
    fs.rmSync(dest, { recursive: true, force: true });
    console.error("Bundle assembly leaked withheld paths — bundle destroyed:");
    for (const l of leaked) console.error(`  - ${l}`);
    process.exit(1);
  }

  let head = "";
  try {
    head = require("child_process")
      .execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    // not a git repo, or git absent — the manifest just omits the commit
  }
  const sha = (abs) => crypto.createHash("sha256").update(fs.readFileSync(abs)).digest("hex");
  const manifest =
    [
      "VSDD reviewer bundle manifest (§A.17)",
      `project:   ${state.project || path.basename(root)}`,
      `gate:      ${gate}`,
      `work-item: ${itemId || "(project-level)"}`,
      `source:    ${root}${head ? ` @ ${head}` : ""}`,
      `assembled: ${new Date().toISOString()}`,
      `bundle:    ${dest}`,
      "",
      "withheld path rules applied (absent from the bundle):",
      ...withheld.map((w) => `  - ${w}`),
      "",
      "admitted files (sha256):",
      ...files.map((f) => `  ${sha(path.join(root, f))}  ${f}`),
    ].join("\n") + "\n";

  const record = path.join(
    root,
    ".vsdd",
    "pass-records",
    `gate${gate}${itemId ? `-${itemId}` : ""}-bundle-manifest.txt`
  );
  fs.mkdirSync(path.dirname(record), { recursive: true });
  fs.writeFileSync(path.join(dest, "manifest.txt"), manifest);
  fs.writeFileSync(record, manifest);

  console.log(`Gate ${gate}${itemId ? ` / ${itemId}` : ""} bundle: ${files.length} admitted file(s).`);
  console.log(`  workspace: ${dest}`);
  console.log(`  manifest:  ${path.relative(root, record)}  — commit this with the pass record.`);
  console.log(`  Point the reviewer at the workspace, not the repository.`);
  console.log(`  NOTE: an AI reviewer shares this filesystem and can read the repo around the`);
  console.log(`  bundle. The export gives a human reviewer real isolation and both an audit`);
  console.log(`  trail; it does not deny an agent's file access.`);
}

if (require.main === module) main();

module.exports = { isWithheld, admittedFiles };
