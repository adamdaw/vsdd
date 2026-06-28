#!/usr/bin/env node
// VSDD hard-gate hook. PreToolUse on Write|Edit|MultiEdit|NotebookEdit.
// Blocks edits to implementation source until Gate 3 (tests-vs-spec) is cleared,
// realising Core Principle 8 (External Enforcement) as a deterministic check.
// Outside a VSDD project (no .vsdd/state.json above the target) it is silent.
// Zero dependencies — node only.

const fs = require("fs");
const path = require("path");

const CODE_EXT = new Set([
  "js", "jsx", "ts", "tsx", "mjs", "cjs", "py", "rb", "go", "rs", "java",
  "kt", "scala", "c", "h", "cpp", "cc", "hpp", "cs", "php", "swift", "m",
  "cls", "trigger", "apex", "sql", "sh", "bash", "zsh", "lua", "ex", "exs",
  "clj", "erl", "dart", "vue", "svelte",
]);

// ponytail: heuristic path classification — the CODE_EXT set is the knob.
// Markdown, anything under .vsdd/, test files, and config/scaffolding are
// always allowed; only recognised implementation code is gated. Fail-open for
// unrecognised extensions (data, images): the gate guards implementation, not docs.
function isTestPath(rel) {
  const p = rel.toLowerCase();
  if (/(^|\/)(tests?|spec|__tests__|__test__)\//.test(p)) return true;
  const base = path.basename(p);
  return /(^test_)|(_test\.)|(\.test\.)|(\.spec\.)|(_spec\.)/.test(base);
}

function classify(rel) {
  const p = rel.replace(/\\/g, "/");
  if (/(^|\/)\.vsdd\//.test(p)) return "artifact";
  const ext = path.extname(p).slice(1).toLowerCase();
  if (ext === "md") return "artifact";
  if (isTestPath(p)) return "artifact";
  if (CODE_EXT.has(ext)) return "source";
  return "artifact"; // unknown / config / data — not gated implementation
}

// Walk up from `start` looking for a directory containing .vsdd/state.json.
function findState(start) {
  let dir = start;
  for (;;) {
    const candidate = path.join(dir, ".vsdd", "state.json");
    if (fs.existsSync(candidate)) {
      try {
        return { root: dir, state: JSON.parse(fs.readFileSync(candidate, "utf8")) };
      } catch {
        return null; // unreadable/corrupt state — fail open, don't wedge edits
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

// Pure decision: given the resolved file path and a located state, allow or block.
function decide(filePath, found) {
  if (!found) return { block: false };
  const rel = path.relative(found.root, filePath);
  if (rel.startsWith("..")) return { block: false }; // outside the project
  if (classify(rel) === "artifact") return { block: false };
  const passed = Array.isArray(found.state.gates_passed) ? found.state.gates_passed : [];
  if (passed.includes(3)) return { block: false };
  const phase = found.state.phase ?? "?";
  return {
    block: true,
    reason:
      `VSDD gate: implementation source is locked.\n` +
      `  ${rel}\n` +
      `Project is at phase ${phase}; Gate 3 (Tests vs Spec) is not yet cleared ` +
      `(gates_passed = [${passed.join(", ")}]).\n` +
      `Write the spec and the failing tests first. Once Gate 3 passes, clear it with /vsdd-advance ` +
      `to unlock implementation. (Markdown, tests, and .vsdd/ are never blocked.)`,
  };
}

function main() {
  let raw = "";
  try {
    raw = fs.readFileSync(0, "utf8");
  } catch {
    process.exit(0);
  }
  let input = {};
  try {
    input = JSON.parse(raw || "{}");
  } catch {
    process.exit(0);
  }
  const ti = input.tool_input || {};
  const target = ti.file_path || ti.notebook_path;
  if (!target) process.exit(0);

  const cwd = input.cwd || process.cwd();
  const filePath = path.isAbsolute(target) ? target : path.resolve(cwd, target);
  const found = findState(path.dirname(filePath));
  const verdict = decide(filePath, found);

  if (verdict.block) {
    process.stderr.write(verdict.reason + "\n");
    process.exit(2); // PreToolUse: exit 2 blocks the tool call, stderr returned to Claude
  }
  process.exit(0);
}

if (require.main === module) main();

module.exports = { classify, decide, findState };
