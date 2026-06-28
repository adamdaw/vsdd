---
name: vsdd-phase-4-adversarial
description: >
  Drive VSDD Phase 4 — Adversarial Refinement. Run Gate 4's two sequential
  adversarial passes (spec+test compliance, then code quality) over the
  test-passing implementation, disposition findings, and lock artifacts. Invoke
  when implementation is green and ready for adversarial review.
---

# Phase 4 — Adversarial Refinement (→ Gate 4)

The code survived testing; now it faces the Adversary. A **standing gate** — run on every PR. Two sequential passes; both together are Gate 4. See `methodology/VSDD.md` Phase 4 and §A.7 (pass records), §A.8 (findings).

Use the `vsdd-adversary` skill to assemble the admitted bundle and spawn distinct-invocation reviewers. The bundle excludes deliberation, ADRs, handoff notes, and prior-review narrative (§A.17).

## Pass 1 — Spec & Test Compliance (fidelity)

Agent: `vsdd-spec-reviewer`. Reads implementation against **both spec and tests** — not the Builder's summary. Verifies spec fidelity (no partial credit), and spec gaps revealed by implementation (behaviour with no spec; spec with no implementation). 

Findings are **derivation-fidelity → fixed-only**, routed to the owning phase (requirements gap → Phase 1/Gate 1; spec gap → Phase 2/Gate 2; test/impl gap → Phase 3). **Pass 1 may close only `PASS_CLEAN` or `PASS_FIXED`** — never `PASS_ACCEPTED`. Do not dispatch Pass 2 until Pass 1 passes.

## Pass 2 — Code Quality (only after Pass 1 passes)

Agent: `vsdd-code-reviewer`, a **distinct invocation with no Pass 1 involvement** (independence reset, §A.7). Checks: test quality (a fidelity test defect is still fixed-only), code quality, security surface, process properties, dependency surface (§A.5). Waivable quality/dependency findings may be fixed or carry a committed Architect sign-off (`PASS_ACCEPTED`); a fidelity-class finding caught here is still fixed-only.

## Disposition & records

Present every finding to Adam in full; he dispositions each (§A.8). Non-waivable: CSDD MUST (§A.1), undischarged Prove (§A.3). Edit-minimality is verified here (over-editing review). Write a **composite Gate 4 pass record** (§A.7) — Pass 1 + Pass 2 subrecords, each with its reviewer, independence attestation, and bundle manifest.

## Artifact Locking

Once a pass declaration issues, the artifact is **locked** — no silent back-edits. A later-found gap is a dated addendum / new versioned iteration that re-enters its gate; the prior reviewed state and its pass record stay in history.

## Clearing the gate

Gate 4 clears when **both passes are dispositioned** (every Pass 1 finding fixed; every Pass 2 finding fixed or signed off). Commit the record, then `/vsdd-advance` → Phase 6. **Gate 4 is not merge authority** — a converged release still needs Gate 5 and the Phase 7 roll-up. If findings route upstream, go to `vsdd-phase-5-feedback` (cascade invalidation) before re-review.
