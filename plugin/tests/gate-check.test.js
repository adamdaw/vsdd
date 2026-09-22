#!/usr/bin/env node
// Self-check for the gate hook's decision logic. Run: node tests/gate-check.test.js
const assert = require("assert");
const path = require("path");
const { classify, decide } = require("../hooks/gate-check.js");

const ROOT = "/proj";
const noGates = { root: ROOT, state: { phase: 1, gates_passed: [] } };
const gate3 = { root: ROOT, state: { phase: 3, gates_passed: [1, 2, 3] } };
const abs = (rel) => path.join(ROOT, rel);

// classify
assert.equal(classify("src/app.js"), "source");
assert.equal(classify("Spec.md"), "artifact");
assert.equal(classify("tests/app_test.py"), "artifact");
assert.equal(classify("src/app.test.ts"), "artifact");
assert.equal(classify(".vsdd/pass-records/gate4.md"), "artifact");
assert.equal(classify("package.json"), "artifact"); // config/scaffolding allowed
assert.equal(classify("assets/logo.png"), "artifact"); // unknown -> fail open

// decide: no state -> always allow
assert.equal(decide(abs("src/app.js"), null).block, false);

// (a) gates_passed [] + source -> block
assert.equal(decide(abs("src/app.js"), noGates).block, true);
// (b) gates_passed [] + spec -> allow
assert.equal(decide(abs("Spec.md"), noGates).block, false);
// (c) gates_passed [] + test -> allow (Phase 3a writes tests before Gate 3)
assert.equal(decide(abs("tests/app_test.py"), noGates).block, false);
// (d) Gate 3 cleared + source -> allow
assert.equal(decide(abs("src/app.js"), gate3).block, false);
// file outside project root -> allow
assert.equal(decide("/elsewhere/x.js", noGates).block, false);

// (e) test scaffolding: pre-Gate-3 source is blocked unless the edit is scaffold-tagged
assert.equal(decide(abs("src/lang.ts"), noGates, false).block, true);
assert.equal(decide(abs("src/lang.ts"), noGates, true).block, false); // // vsdd:scaffold edit allowed

// (f) epics: the unlock is the ACTIVE work item's gates, not the project's.
// The project clears Gate 1 only, so reading project gates would lock source forever.
const epic = (activeGates) => ({
  root: ROOT,
  state: {
    phase: 2,
    gates_passed: [1],
    active_item: "ITEM-002",
    items: {
      "ITEM-001": { phase: "done", gates_passed: [2, 3, 4, 5] },
      "ITEM-002": { phase: 3, gates_passed: activeGates },
    },
  },
});
assert.equal(decide(abs("src/app.js"), epic([2])).block, true); // active item pre-Gate-3
assert.equal(decide(abs("src/app.js"), epic([2, 3])).block, false); // active item cleared Gate 3
// a DONE sibling's cleared Gate 3 must not unlock source for the active item
assert.match(decide(abs("src/app.js"), epic([2])).reason, /ITEM-002 is at phase 3/);
// no active_item -> fall back to the project's gates (unchanged behaviour)
assert.equal(
  decide(abs("src/app.js"), { root: ROOT, state: { phase: 2, gates_passed: [1, 2, 3], items: {} } }).block,
  false
);

console.log("gate-check: all assertions passed");
