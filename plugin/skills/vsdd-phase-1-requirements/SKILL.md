---
name: vsdd-phase-1-requirements
description: >
  Drive VSDD Phase 1 — Requirements Refinement. Turn an Intent into an approved
  SRS (and, for an epic, a reviewed work-item decomposition) through Socratic
  deliberation, then clear Gate 1. Invoke at the start of VSDD feature work,
  after /vsdd-init, or when the user is refining requirements / writing an SRS.
---

# Phase 1 — Requirements Refinement (→ Gate 1)

The problem is made legible before anything is designed. Product is the **SRS** (business-facing *what* and *why*) — never the *how* (that is Phase 2). See `methodology/VSDD.md` Phase 1 and `appendix-a-schemas.md` §A.14/§A.15/§A.19.

**Prerequisite:** the **Constitution** (§A.2) exists and is committed. If not, author it first (governing principles, architectural rules, quality goals + coverage floor, dependency-hygiene policy, security-criticality definition + clause register, verification budgets, amendment process).

## Inputs

- **Intent** (§A.15), committed at intake *before* deliberation, with its INTENT-NNN: problem/opportunity, desired outcome, requesting stakeholder, acceptance condition. A request missing outcome or acceptance condition is sent back, not deliberated.

## Steps

1. **Deliberation (Socratic).** Ask one question at a time: clarify ambiguous intent, surface implicit assumptions, identify stakeholders and goals, explore alternative framings, probe "what if X is wrong?". Resolve nothing silently. Two outputs:
   - **SRS** — every clarification written explicitly into the requirements (the input to Phase 2 and the Gate 1 artifact).
   - **ADR entries** (§A.18) — rejected alternatives and reasoning, committed to `docs/adr/`. **Withheld** from the Adversary.
   - Mockups are elicitation aids only — throwaway, not design commitments, not Adversary inputs.
2. **Classify the unit (atomicity test):** single responsibility statable in one line? deployable without a sibling? Both yes → **work item** (light SRS). Either no, or genuinely borderline → **epic** (full SRS, then decomposed).
3. **Author the SRS** (§A.14), tiered:
   - **Full SRS** (epic): purpose/scope, stakeholders, business requirements (MoSCoW), functional requirements (user story → one+ EARS REQ-NNN), NFRs (ISO 25010, measurable), constraints, assumptions/dependencies (impact-if-wrong), Gherkin acceptance criteria for every in-scope-now requirement, traceability matrix.
   - **Light SRS** (work item): EARS requirements + Gherkin AC, grouped by confirmation mode (`automated` / `environment-visible` / `person-confirmed`).
   - **EARS + modal discipline:** SHALL/MUST only; no should/may/could/might. Each requirement a unique REQ-NNN.
   - **WHAT, not HOW** — verifiable by observing behaviour without reading code.
4. **Decomposition bridge (epics):** cut the epic SRS into atomic, independently-deployable work items (§A.9), each with its light SRS, dependencies, and Architect-approved criticality tag.
5. **Newly discovered requirements** (any phase): the Architect classifies into in-scope-now (mint REQ-NNN, scheduled), deferred (REQ-NNN + linked ITEM-NNN + accepted-risk rationale), or rejected (ADR, no REQ-NNN). Never silently dropped or absorbed.
6. **Elicitation-facts record** (§A.19): the bare facts surfaced — stakeholders considered, assumptions, candidates considered-but-not-scheduled, NFR dimensions reviewed. Admitted to the Gate 1 Adversary so completeness is checkable; carries facts, never the *why*.

## Gate 1 — SRS Fidelity

Use `vsdd-adversary` (Gate 1). The Adversary receives the committed Intent, the Constitution, the SRS, and the elicitation-facts record — no deliberation, no ADRs. Each requirement must be: modally conformant, semantically unambiguous, testable without code, complete, non-contradictory (incl. vs Constitution), and WHAT-not-HOW. For an epic, also run the **decomposition checkpoint** (work-item set vs epic SRS: slice fidelity, coverage of every REQ-NNN, dependency acyclicity, criticality correctness).

Findings are **fixed-only** (derivation fidelity — never signed off). Iterate until the Adversary finds no legitimate holes. The Architect signs off the gate verdict.

## Clearing the gate

Commit the Gate 1 pass record(s) (§A.7) to `.vsdd/pass-records/`, then run `/vsdd-advance` → Phase 2. No technical spec authorship begins until Gate 1 is cleared.

**For an epic**, `/vsdd-advance` additionally requires `.vsdd/work-items.md` and the decomposition checkpoint's own pass record at `.vsdd/pass-records/gate1-decomposition.md` — the checkpoint is a gate, not a note, and no item leaves Phase 1 without it. Add `items` and `active_item` to `.vsdd/state.json` at this point (see the `vsdd` skill); clearing the epic's Gate 1 then opens the first item at phase 2.
