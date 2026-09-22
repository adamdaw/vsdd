#!/usr/bin/env node
// Self-check for the reviewer-bundle assembler. Run: node tests/bundle.test.js
const assert = require("assert");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");
const { isWithheld, admittedFiles } = require("../scripts/vsdd-bundle.js");

// isWithheld — the path rule the assembler applies without judgement (§A.17)
const RULES = [".vsdd/adr/", ".vsdd/sessions/", ".vsdd/HANDOFF.md"];
assert.equal(isWithheld(".vsdd/adr/ADR-001.md", RULES), true); // inside a withheld subtree
assert.equal(isWithheld(".vsdd/adr", RULES), true); // the subtree root itself
assert.equal(isWithheld(".vsdd/HANDOFF.md", RULES), true); // exact file
assert.equal(isWithheld(".vsdd/SRS.md", RULES), false); // admitted sibling
assert.equal(isWithheld(".vsdd/adrenaline.md", RULES), false); // prefix must respect the "/"

// End-to-end: assemble a Gate 2 bundle from a throwaway project.
const proj = fs.mkdtempSync(path.join(os.tmpdir(), "vsdd-bundle-test-"));
fs.mkdirSync(path.join(proj, ".vsdd", "adr"), { recursive: true });
fs.mkdirSync(path.join(proj, ".vsdd", "pass-records"), { recursive: true });
const write = (rel, body) => fs.writeFileSync(path.join(proj, rel), body);
write(".vsdd/SRS.md", "the source artifact\n");
write(".vsdd/SDD.md", "the derived artifact\n");
write(".vsdd/Constitution.md", "the standing governing artifact\n");
write(".vsdd/adr/ADR-001.md", "WITHHELD reasoning\n");
write(".vsdd/HANDOFF.md", "WITHHELD narrative\n");
write(
  ".vsdd/state.json",
  JSON.stringify({
    project: "bundle-test",
    phase: 2,
    gates_passed: [1],
    artifacts: { 1: [".vsdd/SRS.md", ".vsdd/Constitution.md"], 2: [".vsdd/SDD.md"] },
  }) + "\n"
);

// admittedFiles never collects a withheld path even when handed the whole .vsdd/
const swept = admittedFiles(proj, [".vsdd/"], [".vsdd/adr/", ".vsdd/HANDOFF.md"]);
assert.ok(swept.includes(".vsdd/SRS.md"));
assert.ok(!swept.some((f) => f.startsWith(".vsdd/adr/")));
assert.ok(!swept.includes(".vsdd/HANDOFF.md"));

const out = execFileSync("node", [path.join(__dirname, "..", "scripts", "vsdd-bundle.js"), "2"], {
  cwd: proj,
  encoding: "utf8",
});
const dest = /workspace: (.+)/.exec(out)[1].trim();

// admitted present, withheld absent
assert.ok(fs.existsSync(path.join(dest, ".vsdd/SDD.md")));
assert.ok(fs.existsSync(path.join(dest, ".vsdd/SRS.md")));
assert.ok(fs.existsSync(path.join(dest, ".vsdd/Constitution.md")));
assert.ok(!fs.existsSync(path.join(dest, ".vsdd/adr")));
assert.ok(!fs.existsSync(path.join(dest, ".vsdd/HANDOFF.md")));
assert.ok(!fs.existsSync(path.join(dest, ".vsdd/state.json")));

// the manifest is committed alongside the pass record and names what was excluded
const record = path.join(proj, ".vsdd/pass-records/gate2-bundle-manifest.txt");
assert.ok(fs.existsSync(record));
const manifest = fs.readFileSync(record, "utf8");
assert.match(manifest, /withheld path rules applied/);
assert.match(manifest, /\.vsdd\/adr\//);
assert.match(manifest, /[0-9a-f]{64} {2}\.vsdd\/SDD\.md/);

// Gate 5 takes no bundle
assert.throws(() =>
  execFileSync("node", [path.join(__dirname, "..", "scripts", "vsdd-bundle.js"), "5"], {
    cwd: proj,
    stdio: "pipe",
  })
);

fs.rmSync(proj, { recursive: true, force: true });
fs.rmSync(dest, { recursive: true, force: true });
console.log("bundle: all assertions passed");
