---
name: vsdd-phase-2-spec
description: >
  Drive VSDD Phase 2 — Spec Crystallization. Encode the approved SRS into a
  technical SDD (behavioural contract + verification architecture) per work item,
  then clear Gate 2. Invoke after Gate 1 clears, or when the user is writing the
  spec / SDD / verification strategy.
---

# Phase 2 — Spec Crystallization (→ Gate 2)

With an approved SRS, the Builder produces a **Software Design Document (SDD)** per work item — the *how* and *what-must-be-provable*. See `methodology/VSDD.md` Phase 2 and §A.11 (SDD), §A.1 (CSDD), §A.3 (provable-property table), §A.6 (research artifact).

## Step 2a — Behavioural Specification

- **Behavioural contract:** preconditions, postconditions, invariants. Each SRS REQ-NNN becomes a formal contract clause carrying its identifier forward.
- **Interface definition:** input/output/error types, unambiguous (OpenAPI/GraphQL schema or type signature + doc contract).
- **Edge-case catalog:** walk the per-input-type checklist — null, empty, boundary/max, negative/out-of-range, malformed/encoding, concurrent. An edge case first surfaced here is written back to the SRS as a versioned addendum (new REQ-NNN) that re-enters Gate 1 before Phase 2 continues.
- **NFRs:** performance/memory/security bounds baked in.
- **Security clauses (security-critical CWE surfaces):** author `SEC-NNN` instances (§A.1) applying the Constitution's `SECT-NNN` templates — CWE ref, MUST/SHOULD/MAY, safe pattern, enforcement mechanism + owning gate, verification reference. A live CWE surface with no active template **fails Gate 2** until the Architect adds the template by amendment. A financial-only critical item with no CWE surface authors no clause (but carries §A.3 proof duties).

## Step 2b — Verification Architecture (Architect-approved proposal)

- **Provable-properties catalog:** classify each property Prove vs Test-only by the §A.3 decision table (security boundary, financial, data integrity, safety/regulatory → Prove; concurrency → Prove or bounded model check with a bound statement against the operating envelope). Rule-based, not taste.
- **Purity boundary map:** separate the deterministic pure core from the effectful shell — the most consequential design decision; it shapes module boundaries and dependency direction.
- **Verification tooling selection:** pick the stack (Kani/CBMC/Dafny/TLA+…) and the constraints it imposes. If tooling is uncertain (first use, unsupported language/property pair, unproven scale, no prior passing proof), produce a **Research artifact** (§A.6) spike first.
- **Property specifications:** draft the actual formal property for *every* Prove-classified property. A Prove property with no drafted spec and no §A.6 inexpressibility record fails Gate 2.

The purity boundary and tooling are **architectural** — the Builder proposes; the **Architect approves** before Gate 2.

## Step 2c — Gate 2 — Spec Fidelity

Use `vsdd-adversary` (Gate 2). The Adversary receives the approved SRS, the Constitution, and the SDD (plus any §A.6 result) — no deliberation, no ADRs. It hunts: ambiguity, missing edge cases, implicit assumptions, internal contradictions, **contradictions with the Constitution** (remedy is an amendment, never a silent exception), properties marked testable-only that should be Prove, purity-boundary violations, verification-tool mismatches.

Findings are **fixed-only**. Iterate until no legitimate holes remain; the Architect signs off.

## Tracker integration

Each spec maps to a work item; sub-items for each contract clause, edge case, NFR, and provable property (provable properties get their own chain so proof status is tracked independently).

## Clearing the gate

Commit the Gate 2 pass record (§A.7), then `/vsdd-advance` → Phase 3. No tests are written until Gate 2 is cleared.
