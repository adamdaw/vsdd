---
name: vsdd-phase-6-hardening
description: >
  Drive VSDD Phase 6 — Formal Hardening. Execute the Phase 2b verification plan
  against the implementation (proofs, fuzzing, mutation, security hardening,
  purity audit, manual-acceptance execution) and clear Gate 5. Invoke after Gate
  4 clears, or when the user runs verification / hardening.
---

# Phase 6 — Formal Hardening (→ Gate 5)

The Phase 2b verification architecture is now *executed* against the battle-tested implementation. Because the code was architected with a pure core, the tools engage without heroic refactoring. See `methodology/VSDD.md` Phase 6 and §A.4 (fuzzing), §A.5 (CVE), §A.10 (manual acceptance), §A.13/§A.16 (limitation / non-converged release).

## Gate 5 checks (each owned by exactly one gate per §A.2 matrix)

- **Proof execution:** run the drafted property specs (Kani/Dafny/TLA+…). Every Phase 2b Prove property must discharge, or a permitted bounded-concurrency result hold. An **undischarged Prove property blocks the gate** — it is non-convergence (§A.3), never a passing result.
- **Fuzz testing** (§A.4): run the campaign to its Constitution budget (minimum effort **and** coverage plateau in executions; sanitizers on; persisted corpus). Every crash is minimised, captured as a regression test, and **fixed** — no crash carried open. A budget shortfall is a *fixable* gap (spend more / scope tighter), not a release-eligible limitation.
- **Security hardening:** run only the **Gate-5-owned** analyzers / crypto-edge-case suites (Wycheproof, whole-program scans) — Gate 4's diff-scoped analysis is *not* rerun; Gate 5 consumes its committed evidence.
- **Mutation testing:** every surviving mutant is killed by a new/strengthened test, or closed as `verified-equivalent` with committed justification (§A.8). A **non-equivalent survivor is fixed-only.**
- **Purity boundary audit:** any side effect that crept into the pure core is refactored out (**fixed-only**).
- **Manual-acceptance execution** (§A.10): every `environment-visible` / `person-confirmed` scenario whose Gate 3 record is `planned` is now executed against the hardened build and moved to `executed`. Convergence requires `executed`, not planned.

## Gate 5 — Verification

Predominantly deterministic (prover, fuzzer, mutation-tester — adversaries that cannot be flattered or fatigued), with the recorded **manual exceptions** the Constitution designates (baseline two: equivalent-mutant justification, purity-boundary audit conclusion) following the Principle 8 manual-exception rule (committed, Architect-signed evidence).

Demonstrated defects (fuzz crashes, non-equivalent mutants, purity violations) are **fixed-only**; waivable hardening-analyzer findings may close `PASS_ACCEPTED`; the Prove-invariant discharge is non-acceptable.

## Clearing the gate

Write the **composite Gate 5 pass record** (§A.7) — one tool subrecord per check + one manual-exception subrecord per human judgment; final verdict PASS only when every subrecord passes. Then `/vsdd-advance` → Phase 7.

If a Prove property cannot discharge at Gate 5 despite passing Gate 2 as provable (the foreseen-provable-but-execution-surprised case), it is honest non-convergence: record a §A.13 Documented-Limitation. De-scoping is the default; a §A.16 Non-Converged Release is the last resort, after proving, re-architecting, and de-scoping are all shown infeasible. Otherwise route fixes through `vsdd-phase-5-feedback`.
