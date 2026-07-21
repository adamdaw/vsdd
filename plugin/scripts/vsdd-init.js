#!/usr/bin/env node
// vsdd-init [project-name] — initialise VSDD enforcement in the current project.
// Writes .vsdd/state.json (the activation switch the gate hook reads). The hook
// ships with the plugin and is silent in any tree without this file, so no
// per-project hook registration is needed once the plugin is installed.
// Zero dependencies — node only.

const fs = require("fs");
const path = require("path");

// ponytail: conventional default artifact paths written into state.json so they
// are visible and editable per project. A trailing "/" means "directory with a
// non-empty file"; otherwise "non-empty file". Edit these if your layout differs.
const DEFAULT_ARTIFACTS = {
  1: ["Intent.md", "SRS.md", "Constitution.md"],
  2: ["SDD.md"],
  3: ["tests/"],
  4: [".vsdd/pass-records/gate4.md"],
  5: [".vsdd/pass-records/gate5.md"],
};

function main() {
  const force = process.argv.includes("--force");
  const name =
    process.argv.slice(2).find((a) => !a.startsWith("-")) ||
    path.basename(process.cwd());

  const dir = path.join(process.cwd(), ".vsdd");
  const file = path.join(dir, "state.json");

  if (fs.existsSync(file) && !force) {
    console.error(`.vsdd/state.json already exists. Use --force to overwrite.`);
    process.exit(1);
  }

  const state = {
    project: name,
    phase: 1,
    gates_passed: [],
    artifacts: DEFAULT_ARTIFACTS,
  };

  fs.mkdirSync(path.join(dir, "sessions"), { recursive: true });
  fs.mkdirSync(path.join(dir, "pass-records"), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(state, null, 2) + "\n");

  console.log(`VSDD initialised for "${name}".`);
  console.log(`  .vsdd/state.json written — phase 1, no gates passed.`);
  console.log(`  Track .vsdd/ in git. Implementation source stays locked until Gate 3.`);
  console.log(`  Next: Phase 1 — author Intent.md, SRS.md, Constitution.md, then /vsdd-advance.`);
}

main();
