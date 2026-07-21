---
name: vsdd-phase-3-tests-impl
description: >
  Drive VSDD Phase 3 — Test Generation & TDD Implementation. Write failing tests
  from the spec, clear Gate 3 (before any implementation), then implement
  minimally under TDD. Invoke after Gate 2 clears, or when the user is writing
  tests or implementation under VSDD.
---

# Phase 3 — Test Generation & TDD Implementation (→ Gate 3, then implement)

Red → Green → Refactor, enforced. The gate hook **blocks implementation source until Gate 3 clears** — but markdown and test files are always allowed, so you write the tests first. See `methodology/VSDD.md` Phase 3 and §A.10 (manual acceptance), §A.12 (TDD compliance log).

## Step 3a — Test Suite Generation (implementation still locked)

Translate the spec directly into executable tests:

- **Unit tests:** one+ per behavioural-contract item; every postcondition an assertion, every precondition violation a test expecting a specific error.
- **Edge-case tests:** every item in the Edge Case Catalog.
- **Integration tests** and **property-based tests** (Hypothesis/fast-check/proptest) for invariants over randomised inputs.

**The Red Gate:** every new work-item test must **fail** while the pre-existing suite stays **green**. A new test that passes with no implementation is suspect — flag it. The only substitute is a committed **no-red justification** (Principle 3) — a *narrow residual*, valid only after the exemption ladder is ruled out in order: (1) behaviourally consequential → test it; (2) enables a target test → scaffold it (below); (3) build/infra/proof → Gate 5/Constitution; (4) manual-only → §A.10 `planned`. Only a platform-mandated inert construct that survives all four qualifies, and the justification must name which rungs it ruled out.

**Test scaffolding (brownfield capability-additions).** A behavioural test sometimes can't even *run* before some inert plumbing exists — a third-party asset vendored, a capability registered (e.g. vendor a parser grammar + register a language so its parsing tests execute and fail instead of skipping). That plumbing is **test scaffolding**, permitted before Gate 3, but only under the discriminator: **an edit is scaffolding iff every *behavioural* target test stays red after it — the moment it greens a behavioural target it is implementation and stays gated.** It auto-sorts the cases: the edit that greens a recognition test (a behavioural REQ) *is* the recognition implementation (gated); the inert registration that only lets the behavioural tests *run and fail* is scaffolding. Vendoring a third-party asset + its manifest/loader registration is rung-3 build/infra (Principle 3) — a test asserting that infra is *present* is an infra-presence test, not a behavioural target, and may green. Tag each scaffold edit `// vsdd:scaffold` (the hook permits tagged edits), and record it in `.vsdd/tdd/scaffold-ledger.md`: file/region, what it is, why non-functional, the target tests it makes executable, and the committed test-run evidence that those targets stayed **red** (none greened). `vsdd-advance` refuses Gate 3 if scaffold edits exist without the ledger; the Adversary verifies the red-stays-red claim against the tagged diffs.

**Bug fixes (Red–Green–Revert):** (1) confirm the regression test fails on broken code; (2) apply the fix, confirm it passes; (3) revert, confirm it fails again; (4) leave the code reverted (red). The apply/revert is a throwaway validation patch — never committed onto the reviewed branch; commit only the four-command **cycle record**.

## Gate 3 — Tests vs Spec (before any implementation)

Use the `vsdd-test-validator` agent (via `vsdd-adversary`, Gate 3). With the suite written and red, it reviews tests against the spec + the Red-Gate evidence: every contract item and `automated` Gherkin scenario maps to an executable test; `environment-visible` / `person-confirmed` scenarios map to a `planned` manual-acceptance record (§A.10); no test is tautological or over-mocked; the Red Gate holds; and — where capability scaffolding was used — every `// vsdd:scaffold`-tagged edit is genuinely non-functional (greens no target test), per the scaffold ledger. Findings are **fixed-only** and return to Step 3a (tests) or Phase 2 (spec).

A **conservative / degrade-don't-lie** requirement ("when ambiguous, leave unresolved — never guess") must be enforced at **every** independent code path that could fall back to a best guess, not one — so fixtures exercise each path shape (qualified vs unqualified, exact-miss vs multi-match). A single flag on the obvious path ships the others non-conservative.

**Clear the gate:** commit the Gate 3 pass record, then `/vsdd-advance`. This unlocks implementation source.

## Step 3b — Minimal Implementation (now unlocked)

One failing test at a time: pick it, write the smallest code that passes, run the full suite (nothing else breaks), repeat. Keep a **TDD compliance log** (§A.12): failing test → implementation → pass, with changed files, linked test ID, and a one-line justification the diff is confined to satisfying that test. Minimality is checked against this log at Gate 4, not self-certified.

## Step 3c — Refactor

After green, refactor for clarity/performance/NFRs under the green suite (a behaviour-preserving refactor needs no new red test; it belongs in a separately-scoped commit, not folded into a fix).

## Step 3d — Builder Self-Review

A pre-flight self-critique against the spec — fix what you can, escalate what needs the Architect. **Not** a gate; not a substitute for adversarial review. (The Human Checkpoint in 3c is likewise non-gating.)

## Handoff

Implementation complete and green → proceed to Phase 4 (`vsdd-phase-4-adversarial`). Gate 4 is cleared there; do not `/vsdd-advance` again until Gate 4 passes.
