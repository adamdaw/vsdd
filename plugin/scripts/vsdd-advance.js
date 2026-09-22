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

// Test-scaffolding integrity (Gate 3): if any `// vsdd:scaffold`-tagged edit
// exists, a scaffold ledger MUST be present — the ledger carries the red-stays-red
// evidence the Adversary verifies. This is the mechanical presence half; the
// substantive "greened no target test" check is the committed Red-Gate evidence +
// the Gate-3 Adversary (vsdd-advance executes no tests).
// ponytail: bounded scan — skips heavy/generated dirs and large/binary files;
// if it ever costs too much, gate on an explicit state.json flag instead.
const SCAFFOLD_SENTINEL = "vsdd:scaffold";
const SCAN_SKIP = new Set([
  "node_modules", ".git", "dist", "build", "out", "coverage", "vendor", ".vsdd",
]);
function treeUsesScaffolding(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return false;
  }
  for (const e of entries) {
    if (e.name.startsWith(".") && e.isDirectory() && e.name !== ".github") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SCAN_SKIP.has(e.name)) continue;
      if (treeUsesScaffolding(full)) return true;
    } else if (e.isFile()) {
      try {
        if (fs.statSync(full).size > 512 * 1024) continue;
        if (fs.readFileSync(full, "utf8").includes(SCAFFOLD_SENTINEL)) return true;
      } catch {
        // unreadable/binary — skip
      }
    }
  }
  return false;
}

// --- Epics (multi-work-item projects) --------------------------------------
// `state.items` is OPTIONAL and everything here is inert without it: a
// standalone work item has no parent epic and no decomposition checkpoint
// (§A.9), and runs Gates 1-5 itself exactly as it always has.
//
// With `items`, the project clears Gate 1 once — the epic SRS *and* the
// decomposition checkpoint — and each work item then runs Gates 2-5 on its own,
// routed by the dependency DAG. Clearing an item's Gate 5 finishes that item,
// not the epic; Phase 7 is reached only when every item is done.

// ponytail: conventional .vsdd-relative paths, named in the error message so
// they are discoverable. The plugin already fixes .vsdd/pass-records/.
const DECOMPOSITION_ARTIFACTS = [
  ".vsdd/work-items.md",
  ".vsdd/pass-records/gate1-decomposition.md",
];

const gatesOf = (o) => (Array.isArray(o.gates_passed) ? o.gates_passed : []);
const isDone = (it) => it.phase === "done";

function assertAcyclic(items) {
  const mark = new Map(); // id -> 1 visiting, 2 finished
  const visit = (id, trail) => {
    if (mark.get(id) === 2) return;
    if (mark.get(id) === 1) {
      console.error(`Work-item dependency cycle: ${[...trail, id].join(" -> ")}`);
      console.error(`A decomposition's dependency graph must be acyclic (§A.9).`);
      process.exit(1);
    }
    mark.set(id, 1);
    for (const dep of items[id].deps || []) {
      if (!items[dep]) {
        console.error(`Work item ${id} depends on unknown item "${dep}".`);
        process.exit(1);
      }
      visit(dep, [...trail, id]);
    }
    mark.set(id, 2);
  };
  for (const id of Object.keys(items)) visit(id, []);
}

function readyItems(items) {
  return Object.keys(items).filter(
    (id) => !isDone(items[id]) && (items[id].deps || []).every((d) => isDone(items[d]))
  );
}

// Point the project at the next item the DAG unblocks. Mutates state; returns
// the line to print.
function routeNext(state, items) {
  const ready = readyItems(items);
  if (!ready.length) {
    state.active_item = null;
    state.phase = 7;
    return `  All work items done. Next: commit the Phase 7 epic convergence roll-up.`;
  }
  if (ready.length > 1) {
    state.active_item = null;
    return (
      `  Ready (dependencies met): ${ready.join(", ")}.\n` +
      `  The DAG gates parallelism, it does not choose order — set "active_item" in .vsdd/state.json.`
    );
  }
  state.active_item = ready[0];
  items[ready[0]].phase = 2;
  return `  Next work item: ${ready[0]} — phase 2 (author its SDD).`;
}

function main() {
  const file = findStateFile(process.cwd());
  if (!file) {
    console.error("No .vsdd/state.json found. Run vsdd-init first.");
    process.exit(1);
  }
  const root = path.dirname(path.dirname(file));
  const state = JSON.parse(fs.readFileSync(file, "utf8"));

  const items = state.items && Object.keys(state.items).length ? state.items : null;
  if (items) assertAcyclic(items);

  // The epic's own Gate 1 comes first; only then do items advance.
  const itemId = items && gatesOf(state).includes(1) ? state.active_item : null;
  if (items && gatesOf(state).includes(1) && !items[itemId]) {
    const ready = readyItems(items);
    console.error(`No active work item. Set "active_item" in .vsdd/state.json to one of:`);
    console.error(`  ${ready.length ? ready.join(", ") : "(none ready — every item is done)"}`);
    process.exit(1);
  }
  const target = itemId ? items[itemId] : state;
  const passed = gatesOf(target);
  const nextGate = (passed.length ? Math.max(...passed) : itemId ? 1 : 0) + 1;

  if (nextGate > 5) {
    console.log(
      itemId
        ? `${itemId} has cleared all its gates. Set "active_item" to the next item.`
        : "All five gates cleared. Proceed to Phase 7 convergence roll-up."
    );
    process.exit(0);
  }

  // An item may override the epic's artifact paths per gate (SDD-002.md rather
  // than SDD.md); absent an override the epic-level list applies.
  let required =
    (target.artifacts && target.artifacts[nextGate]) ||
    (itemId && state.artifacts && state.artifacts[nextGate]) ||
    [];
  // An epic's Gate 1 is also the decomposition checkpoint (§A.9, finding #5).
  if (items && !itemId && nextGate === 1) required = [...required, ...DECOMPOSITION_ARTIFACTS];
  const missing = required.filter((spec) => !satisfied(root, spec));
  if (missing.length) {
    console.error(`Cannot clear ${GATE_NAME[nextGate]}: required artifacts missing or empty:`);
    for (const m of missing) console.error(`  - ${m}`);
    console.error(`Create them (or edit .vsdd/state.json "artifacts") and re-run vsdd-advance.`);
    process.exit(1);
  }

  // Gate 3: test scaffolding requires its ledger (see Phase 3, the Red Gate).
  if (nextGate === 3 && treeUsesScaffolding(root) && !satisfied(root, ".vsdd/tdd/scaffold-ledger.md")) {
    console.error(`Cannot clear ${GATE_NAME[nextGate]}: '// vsdd:scaffold'-tagged edits exist but`);
    console.error(`  .vsdd/tdd/scaffold-ledger.md is missing or empty.`);
    console.error(`Record each scaffold edit + the evidence its target tests stayed red, then re-run.`);
    process.exit(1);
  }

  target.gates_passed = [...passed, nextGate];
  target.phase = NEXT_PHASE[nextGate];

  // Routing happens at two points only: when the epic's Gate 1 opens the first
  // item, and when an item's Gate 5 finishes it.
  let routed = "";
  if (itemId && nextGate === 5) {
    target.phase = "done";
    routed = routeNext(state, items);
  } else if (items && !itemId && nextGate === 1) {
    routed = routeNext(state, items);
  }

  fs.writeFileSync(file, JSON.stringify(state, null, 2) + "\n");

  console.log(`Cleared ${GATE_NAME[nextGate]}${itemId ? ` for ${itemId}` : ""}.`);
  console.log(`  gates_passed = [${target.gates_passed.join(", ")}]  phase = ${target.phase}`);
  if (nextGate === 3) console.log(`  Implementation source is now UNLOCKED.`);
  if (routed) console.log(routed);
  if (nextGate === 5 && !items) console.log(`  Next: commit the Phase 7 convergence roll-up record.`);
}

main();
