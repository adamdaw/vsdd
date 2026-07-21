---
name: vsdd-phase-7-convergence
description: >
  Drive VSDD Phase 7 — Convergence. Perform the deterministic convergence
  roll-up: assert every gate record is committed, every finding dispositioned,
  manual acceptance executed, no open limitation, and one hash-consistent
  artifact lineage. Invoke after Gate 5 clears, or when declaring done.
---

# Phase 7 — Convergence (the exit signal, no gate)

Convergence is declared **per dimension by committed evidence**, never by a reviewer's sense of "done". It is a **deterministic roll-up**, not a fresh adversarial review (the reviews were Gates 1–5). See `methodology/VSDD.md` Phase 7 and §A.7 (roll-up), §A.8 (dispositions), §A.10 (manual acceptance), §A.16 (non-converged release).

## Per-dimension convergence

| Dimension | Criterion |
|---|---|
| Requirements (SRS) | Gate 1 record committed; every finding fixed; none open. |
| Spec | Gate 2 record committed; every finding fixed; none open. |
| Tests | (a) Gate 3 record committed, findings fixed; (b) every manual-acceptance record (§A.10) `executed` against the hardened build. Both must hold. |
| Implementation | Gate 4 record committed (both passes dispositioned); Pass 1 fixed, Pass 2 fixed or signed off; coverage meets the Constitution floor. |
| Verification | Gate 5: every finding dispositioned; every Prove property discharged (or permitted bounded result); fuzz ran to budget with no open crash; hardening passes thresholds; every mutant killed or `verified-equivalent`; purity audit clean. |
| Edit minimality | Verified at Gate 4 Pass 2; minimality verdict recorded. |

## The roll-up record (§A.7, verdict `CONVERGED`)

Commit a convergence record asserting **all** of:

1. The five gate pass records committed.
2. Every finding's disposition (§A.8), with accepted risks (`signed-off` / `accept-risk-deferred`) **enumerated explicitly** — nothing hidden.
3. Every required manual-acceptance record `executed`.
4. **No open Documented-Limitation** (§A.13) — the roll-up is full-convergence-only.
5. **One hash-consistent artifact lineage** — each gate's source-artifact hash equals the prior gate's derived-artifact hash, and the Gate 4 / Gate 5 implementation hash equals the release candidate. A mismatch means a stale record: re-run the superseded gate (Phase 5 cascade) before asserting convergence.

The roll-up carries no adversarial verdict — only this assertion. A convergence claim without the record is an assertion without evidence (Principle 11).

## Zero-Slop bar

**Maximum Viable Refinement** = every dimension converged. Zero-Slop = *zero open findings, with every accepted risk enumerated in the roll-up* — not zero accepted risk. Every line of production behaviour traces to a REQ-NNN through its spec contract, is covered by a test or executed manual-acceptance record, has survived adversarial scrutiny, and every Prove property is proven. Supporting code (proof harnesses, scaffolding, governance) traces to the Constitution or the verification artifact it serves.

## Two terminal states

- **Full convergence** — the roll-up above. Work item → `done`.
- **Non-converged release (§A.16)** — the Architect's labelled, non-delegable decision to ship an artifact carrying an open §A.13 limitation (only an undischarged Prove property qualifies, only after proving/re-architecting/de-scoping are all infeasible). It does **not** carry the verification guarantee and is never a roll-up. Work item → `released-non-converged`. A CSDD MUST violation or a fidelity gap can take neither route — they are fixed.

There is no `/vsdd-advance` past Gate 5; convergence is committing the roll-up, not clearing a gate.
