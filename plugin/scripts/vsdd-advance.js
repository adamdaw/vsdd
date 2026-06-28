#!/usr/bin/env node
// vsdd-advance — clear the next VSDD gate and advance the phase pointer.
// Refuses to clear a gate whose required artifacts (state.json "artifacts" map)
// are absent or empty — a deterministic precondition, presence-only; content
// fidelity remains the human gate review (Core Principle 8 / Principle 11).
// Zero dependencies — node only.

const fs = require("fs");
const path = require("path");

// Phase the project lands in after clearing each gate. The irregular phase<->gate
// coupling lives here, in one place; the hook never sees it.
//   Gate 1 -> Phase 2 (author the SDD)
//   Gate 2 -> Phase 3 (author failing tests)
//   Gate 3 -> Phase 3 (implementation unlocked; then Phase 4 adversarial review)
//   Gate 4 -> Phase 6 (formal hardening; Phase 5 feedback loops back as needed)
//   Gate 5 -> Phase 7 (convergence roll-up)
const NEXT_PHASE = { 1: 2, 2: 3, 3: 3, 4: 6, 5: 7 };
const GATE_NAME = {
  1: "Gate 1 — SRS Fidelity (Intent -> SRS)",
  2: "Gate 2 — Spec Fidelity (SRS -> SDD)",
  3: "Gate 3 — Tests vs Spec (before implementation)",
  4: "Gate 4 — Implementation vs Spec + Tests (Pass 1 + Pass 2)",
  5: "Gate 5 — Verification (proofs, fuzz, mutation, hardening, purity)",
};

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

function dirHasNonEmptyFile(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isFile() && fs.statSync(full).size > 0) return true;
    if (e.isDirectory() && dirHasNonEmptyFile(full)) return true;
  }
  return false;
}

function satisfied(root, spec) {
  const wantDir = spec.endsWith("/");
  const abs = path.join(root, spec);
  if (!fs.existsSync(abs)) return false;
  const st = fs.statSync(abs);
  if (wantDir || st.isDirectory()) return st.isDirectory() && dirHasNonEmptyFile(abs);
  return st.size > 0;
}

function main() {
  const file = findStateFile(process.cwd());
  if (!file) {
    console.error("No .vsdd/state.json found. Run vsdd-init first.");
    process.exit(1);
  }
  const root = path.dirname(path.dirname(file));
  const state = JSON.parse(fs.readFileSync(file, "utf8"));
  const passed = Array.isArray(state.gates_passed) ? state.gates_passed : [];
  const nextGate = (passed.length ? Math.max(...passed) : 0) + 1;

  if (nextGate > 5) {
    console.log("All five gates cleared. Proceed to Phase 7 convergence roll-up.");
    process.exit(0);
  }

  const required = (state.artifacts && state.artifacts[nextGate]) || [];
  const missing = required.filter((spec) => !satisfied(root, spec));
  if (missing.length) {
    console.error(`Cannot clear ${GATE_NAME[nextGate]}: required artifacts missing or empty:`);
    for (const m of missing) console.error(`  - ${m}`);
    console.error(`Create them (or edit .vsdd/state.json "artifacts") and re-run vsdd-advance.`);
    process.exit(1);
  }

  state.gates_passed = [...passed, nextGate];
  state.phase = NEXT_PHASE[nextGate];
  fs.writeFileSync(file, JSON.stringify(state, null, 2) + "\n");

  console.log(`Cleared ${GATE_NAME[nextGate]}.`);
  console.log(`  gates_passed = [${state.gates_passed.join(", ")}]  phase = ${state.phase}`);
  if (nextGate === 3) console.log(`  Implementation source is now UNLOCKED.`);
  if (nextGate === 5) console.log(`  Next: commit the Phase 7 convergence roll-up record.`);
}

main();
