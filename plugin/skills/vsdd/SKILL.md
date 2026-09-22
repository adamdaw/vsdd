---
name: vsdd
description: >
  Drive the VSDD (Verified Spec-Driven Development) pipeline — 7 phases, 5 gates,
  hard-gate enforced. Invoke when starting a project under VSDD, running or
  advancing a phase, checking gate state, or when the user mentions VSDD,
  spec-driven development with verification, or the Architect/Builder/Adversary
  roles. This is the orchestrator; each phase has its own per-phase skill.
---

# VSDD — Verified Spec-Driven Development

VSDD fuses Spec-Driven Development, Test-Driven Development, and Verification-Driven Development into one AI-orchestrated pipeline with **7 phases** and **5 gates**. The methodology is the spec for this plugin: `methodology/VSDD.md` and `methodology/appendix-a-schemas.md` (§A.1–A.19) in this repo. Read the relevant sections when a phase needs detail this skill compresses away.

## Code-enforced gates (how enforcement actually works)

Gates are enforced by a **PreToolUse hook** (`gate-check.js`), not by convention — Core Principle 8 (External Enforcement). In any project with a `.vsdd/state.json`, the hook **blocks Write/Edit to implementation source until Gate 3 (Tests vs Spec) is cleared**. Markdown, test files, config/scaffolding, and anything under `.vsdd/` are never blocked — so the spec and the failing tests get written first. Outside a VSDD project (no state file) the hook is silent.

**State file** `.vsdd/state.json` (committed to git, lives in the project being built):

```json
{
  "project": "name",
  "phase": 1,
  "gates_passed": [],
  "artifacts": {
    "1": ["Intent.md", "SRS.md", "Constitution.md"],
    "2": ["SDD.md"],
    "3": ["tests/"],
    "4": [".vsdd/pass-records/gate4.md"],
    "5": [".vsdd/pass-records/gate5.md"]
  }
}
```

- `gates_passed` is the only field the hook reads (source unlocks when it contains `3`) — in an epic, the **active item's** `gates_passed`.
- `artifacts` lists the files each gate requires; `/vsdd-advance` refuses to clear a gate whose listed artifacts are missing or empty. Edit this map if your layout differs (a trailing `/` means "directory with a non-empty file"). The default map is **greenfield-shaped**; a **brownfield** project (a fork, or adding a capability to an existing host) almost always needs custom artifact paths — hand-edit the map to point at where the SRS/SDD/tests actually live before advancing.
- `evidence` declares the §A.17 admitted/withheld path split the reviewer-bundle assembler applies. Defaults withhold `.vsdd/adr/`, `.vsdd/sessions/`, `.vsdd/research/`, `.vsdd/HANDOFF.md`.

### Epics (more than one work item)

A **standalone** work item has no parent epic and needs none of this. For an epic, hand-add `items` and `active_item` at the Phase 1 decomposition bridge (§A.9):

```json
"active_item": "ITEM-001",
"items": {
  "ITEM-001": { "phase": 1, "gates_passed": [], "deps": [],
                "artifacts": { "2": [".vsdd/SDD-001.md"], "3": ["tests/one/"] } },
  "ITEM-002": { "phase": 1, "gates_passed": [], "deps": ["ITEM-001"] }
}
```

The **project** clears Gate 1 once — the epic SRS *and* the decomposition checkpoint, which additionally requires `.vsdd/work-items.md` and `.vsdd/pass-records/gate1-decomposition.md`. Each item then runs **Gates 2–5** on its own; an item entering work starts at phase 2, since its light-SRS slice came out of decomposition. Per-item `artifacts` override the epic's map per gate; anything not overridden falls back to it.

Clearing an item's Gate 5 finishes **that item**, not the epic: `/vsdd-advance` marks it `done` and routes to the next item whose `deps` are all done. Phase 7 and the convergence roll-up are reached only when every item is done. If two items are ready at once the command names both and stops — the DAG gates parallelism, it does not choose order; set `active_item` yourself. A dependency cycle is refused outright (§A.9).

**Setup:** `/vsdd-init [project-name]` — writes `.vsdd/state.json`. (The hook ships with the plugin; no per-project hook registration is needed.)

**Advance:** `/vsdd-advance` — clears the next gate (after its review actually passed) and advances the phase. It records the gate as cleared; it does **not** perform the review. The review is driven by the per-phase skill and, for Gates 1–4, the reviewer agents.

**Bundle:** `/vsdd-bundle <gate> [ITEM-NNN]` — exports the Adversary's admitted-only workspace and its manifest before a Gate 1–4 review (§A.17). See `vsdd-adversary` for the limit on what it can isolate.

## Roles (5Cs in §II of the methodology)

| Role | Who | Responsibility |
|---|---|---|
| **Architect** | Human (Adam) | Irreducible authority. Frames the problem, owns every gate decision, accepts/rejects convergence. Not delegable. |
| **Builder** | AI (fresh context) | Authors SRS/SDD, writes tests-first, implements minimally against the spec. |
| **Adversary** | AI (distinct invocation, no producer access) or independent human | Reviews each derived artifact against its source. Cannot review its own work. |
| **Tracker** | Issue system | Work-item state + traceability (REQ → Spec → Test → Impl). |

The Adversary's independence is structural: a fresh AI context resets *memory* only; production independence needs a **distinct invocation** with no access to the producer's session/scratch, working from an admitted-only evidence bundle (§A.17). Use the `vsdd-adversary` skill, which enforces this.

## The 7 phases / 5 gates

Drive each with its per-phase skill. The gate's review is real work; `/vsdd-advance` only records it.

| Phase | Skill | Gate (and what it reviews) |
|---|---|---|
| 1 — Requirements Refinement | `vsdd-phase-1-requirements` | **Gate 1** — SRS vs Intent (+ decomposition checkpoint) |
| 2 — Spec Crystallization | `vsdd-phase-2-spec` | **Gate 2** — SDD vs SRS |
| 3 — Test Gen & TDD Impl | `vsdd-phase-3-tests-impl` | **Gate 3** — Tests vs Spec (before impl); then implement |
| 4 — Adversarial Refinement | `vsdd-phase-4-adversarial` | **Gate 4** — Impl vs Spec+Tests (Pass 1) + Code Quality (Pass 2) |
| 5 — Feedback Integration | `vsdd-phase-5-feedback` | (no gate) — route fixes to owning phase; cascade-invalidate. Always-on, invoked whenever a finding must be integrated — not an end-phase that waits for all work items (that is Phase 7). |
| 6 — Formal Hardening | `vsdd-phase-6-hardening` | **Gate 5** — proofs, fuzz, mutation, hardening, purity |
| 7 — Convergence | `vsdd-phase-7-convergence` | (no gate) — deterministic roll-up; exit signal |

**Prerequisite:** before Phase 1, the Architect establishes a **Constitution** (§A.2) — standing principles, architectural rules, quality goals, dependency-hygiene and security policy. It governs all features and changes only by amendment.

## Reviewer agents (Gates 3–4)

- **Gate 3:** `vsdd-test-validator` — tests vs spec, before implementation exists.
- **Gate 4 Pass 1:** `vsdd-spec-reviewer` — implementation vs spec + tests (fidelity; fixed-only).
- **Gate 4 Pass 2:** `vsdd-code-reviewer` — quality, security, process, dependencies (distinct invocation from Pass 1).

Gate 5 is deterministic tooling (prover, fuzzer, mutation tester) plus two recorded manual exceptions (equivalent-mutant justification, purity-boundary audit).

## Convergence (Phase 7)

Convergence is **per dimension by committed evidence** (§A.7 pass records, §A.8 finding dispositions) — never a reviewer's sense of "done". Derivation-fidelity findings (Gates 1–3, Gate 4 Pass 1) are *fixed*, never signed off. Quality/security/dependency findings (Gate 4 Pass 2, Gate 5 waivable) are fixed or carry committed Architect sign-off. Two classes are non-waivable: a CSDD MUST violation (§A.1) and an undischarged Prove property (§A.3). The exit record is a deterministic roll-up (`CONVERGED`), not a fresh review.

## Session handoff

Per role, at session end, commit a handoff note to the repo (the active work item, what was done/decided, what's open) and read it first on resume — state lives in the repo, not in conversation (Core Principle 11). Handoff notes are **withheld** evidence (§A.17): never an Adversary input.

## Gotchas

- The Adversary's value is context isolation. Never run it in the Builder's conversation.
- Polished AI output is not evidence of correctness — that is why Gates 3–5 exist (Principle 4, "Anti-Slop Bias").
- A new edge case or requirement discovered late does not skip its gate — it re-enters Gate 1/2 as a versioned addendum (Artifact Locking, Phase 4).
- The upstream phases (1–2) are the most information-dense artifacts; prefer local models for them on sensitive projects (§VI, Spec Confidentiality).
- `/vsdd-advance` records a pass; it never substitutes for the review. Confirm the review happened first.
