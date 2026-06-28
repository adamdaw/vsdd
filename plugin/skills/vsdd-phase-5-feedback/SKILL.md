---
name: vsdd-phase-5-feedback
description: >
  Drive VSDD Phase 5 — Feedback Integration Loop. Route each adversary/tool
  finding back to its owning phase, cascade-invalidate the downstream pass
  records it supersedes, and escalate to the Architect on the 3-cycle rule.
  Invoke whenever a gate FAIL or finding must be integrated. No gate of its own.
---

# Phase 5 — Feedback Integration Loop (no gate)

The Adversary's critique feeds back through the whole pipeline. This phase has **no gate** — it routes fixes and re-arms the gates they touch. See `methodology/VSDD.md` Phase 5 and §A.7 (lineage check), §A.13/§A.16 (limitation / non-converged release).

## Routing table

| Finding level | Return to | Re-review at |
|---|---|---|
| Requirements-level | Phase 1 — refine SRS | Gate 1 |
| Spec-level | Phase 2 — update spec | Gate 2 |
| Test-level | Phase 3a — fix/add tests (verify they fail) | Gate 3 |
| Implementation-level | Phase 3b — re-implement minimally, then 3c | Gate 4 |
| New edge case | SDD addendum → Gate 2 (and Gate 1 if a new requirement), then new failing tests → Gate 3 | — |

A requirements-level gap is **never** patched at the spec or code layer.

## Cascade invalidation (the load-bearing rule)

Routing a fix is not enough: changing an upstream artifact **invalidates every downstream pass record derived from it**, which must be re-reviewed against the changed artifact — not carried forward.

- Changed **SRS** → invalidates SDD, test, implementation, proof records (Gates 2–5).
- Changed **SDD/spec** → invalidates test, implementation, proof records (Gates 3–5).
- Changed **tests** → invalidates implementation, proof records (Gates 4–5).
- Changed **implementation** → invalidates verification records (Gate 5).

A superseded gate record is stale evidence: the Phase 7 roll-up's artifact-lineage hash check (§A.7) rejects any record whose source no longer matches the current upstream artifact, so the superseded gate is re-run before convergence. The re-review may be fast for a localised change, but it is never skipped. Practically: when you change an artifact, the corresponding downstream gates must be re-cleared (their entries effectively re-earned) — reflect this by re-running those reviews and re-committing their pass records.

## Regression cycle

After integrating each accepted finding, run the full suite. If a prior passing test now fails, **revert** the integration before proceeding.

## Loop termination — 3-cycle architectural escalation

A *cycle* is one return-and-re-review of a given ITEM-NNN / REQ-NNN / SEC-NNN. Counting is **per affected identifier** (§A.8). If any single identifier reaches **three failed cycles**, stop fixing — the spec or architecture is wrong, not the implementation. Escalate to the Architect, who revises the spec, revises the architecture, or de-scopes. A fourth blind fix attempt is almost always slower and wrong.

**Not every gap can be "accepted":** a derivation-fidelity gap is always fixed (or de-scoped — itself a fix to the SRS), never shipped as a limitation; a CSDD MUST violation is fixed or compliance-verified. The §A.13 Documented-Limitation route is reserved for an undischarged Prove property blocked by external tooling limits — and only via §A.16.

This loop continues until convergence (Phase 7). It has no `/vsdd-advance` step — advance happens only when a gate is re-cleared.
