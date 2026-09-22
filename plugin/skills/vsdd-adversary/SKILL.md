---
name: vsdd-adversary
description: >
  Run a VSDD adversarial gate review with structural independence. Spawns
  distinct-invocation reviewer(s) with a clean context that see only the admitted
  artifacts — no Builder history, no deliberation, no ADRs. Invoke at Gate 1, 2,
  3, or 4 when a derived artifact is ready for its gate, or when the user asks
  for adversarial review / a Gate 4 pass.
---

# VSDD Adversarial Review

The Adversary's value is its independence (Core Principle 7, Entropy Resistance). This skill enforces that structurally: the reviewer is a **distinct invocation** in a clean context that receives only the **admitted** evidence — never the deliberation record, ADRs, handoff notes, or prior-review narrative. A fresh window resets *memory*; a separate invocation with no producer-session access establishes *production* independence (§A.7, §A.17).

## Which gate, which reviewer

| Gate | Reviews | Use |
|---|---|---|
| **Gate 1** | SRS vs committed Intent (+ Constitution, elicitation-facts §A.19) | general adversary (prompt below) |
| **Gate 2** | SDD vs approved SRS (+ Constitution) | general adversary (prompt below) |
| **Gate 3** | Tests vs Spec, before implementation | `vsdd-test-validator` agent |
| **Gate 4 Pass 1** | Implementation vs Spec + Tests (fidelity) | `vsdd-spec-reviewer` agent |
| **Gate 4 Pass 2** | Code quality / security / process / dependencies | `vsdd-code-reviewer` agent (distinct invocation from Pass 1) |

Gate 5 is deterministic tooling, not this skill.

## Assemble the admitted bundle first (§A.17)

Before spawning, identify the **admitted** vs **withheld** paths:

- **Admitted:** the source artifact, the derived artifact under review, the standing governing artifact it must not contradict (Constitution), and the *objective* gate evidence the verdict needs (test-run output, scanner results, prior **finding/disposition records with the rationale field redacted**, §A.8).
- **Withheld (never pass these):** deliberation record, ADR log, handoff notes/session logs, research *rationale* (§A.6), and any prior-review *narrative*.

Run **`/vsdd-bundle <gate> [ITEM-NNN]`** (`scripts/vsdd-bundle.js`). It exports the admitted paths into an isolated workspace outside the repository, refuses and destroys the bundle if any withheld path reached it, and writes the manifest — admitted paths with SHA-256s, and the withheld rules applied — both into the workspace and to `.vsdd/pass-records/gate<N>-bundle-manifest.txt` for committing with the pass record (§A.17 enforcement). The admitted/withheld path rules live in `state.json` under `evidence`; edit them there, never by looking away.

Spawn the reviewer against the **exported workspace path**, not the repository.

## Spawning the reviewer

For Gates 3–4 use the dedicated agents (`vsdd-test-validator`, `vsdd-spec-reviewer`, `vsdd-code-reviewer`) via the Agent tool — each is already scoped and read-only.

For Gates 1–2, spawn a general-purpose agent with a fully self-contained prompt (it has no conversation history):

```
You are the Adversary in a VSDD pipeline at <Gate N>. You review the derived
artifact against its source and the Constitution. You have no knowledge of the
Builder's reasoning — you see only the artifacts below. Do not approve your own
assumptions; flag everything that does not hold. Output format is non-negotiable:
[Location — Topic]: <concrete flaw> -> <proposed correction>. No preamble, no praise.

## Admitted artifacts
<source artifact — full contents>
<derived artifact under review — full contents>
<Constitution — full contents>
<objective evidence — e.g. EARS-lint / contradiction-scan output, §A.19 elicitation facts>

## Checklist (Gate 1: modally conformant · semantically unambiguous · testable
without code · complete against the elicitation-facts record · non-contradictory ·
WHAT-not-HOW. Gate 2: ambiguity · missing edge cases · implicit assumptions ·
contradictions with the Constitution · properties marked testable-only that should
be Prove (§A.3) · purity-boundary violations · verification-tool mismatches ·
unverifiable design pins on unowned behaviour — a claim about code the work item
doesn't own (library, framework/host API, external service, peer), with no SRS basis
and no admitted §A.6 spike → flag as `[Gate-3 reliance]`, never affirm an unowned
component's design you cannot verify from the bundle, §A.11.)

## If genuinely no flaws exist
Output exactly: "Forced to manufacture flaws." then one line stating the artifact
meets the standard. (You are context-free and cannot know whether this is a first
pass or a re-review — always use this invariant on a clean pass; the record-level
PASS_CLEAN vs PASS_FIXED verdict is set from the gate's finding history by the
Architect, not by your phrasing — §A.7.)
```

## Independence reset for multi-pass gates (Gate 4)

Pass 2's reviewer must have **no involvement in Pass 1** — a separate Agent invocation, not the Pass 1 agent re-prompted. Do not dispatch Pass 2 until Pass 1 closes PASS. Record both reviewers' distinctness in the pass record (§A.7).

## After the reviewer returns

1. Present **every** finding to Adam in full — do not summarise or filter. Adam dispositions each (§A.8): `fixed`, `signed-off`, `accept-risk-deferred`, etc. Remember:
   - Derivation-fidelity findings (Gates 1–3, Gate 4 Pass 1) are **fixed-only** — never signed off.
   - CSDD MUST (§A.1) and undischarged Prove (§A.3) are non-waivable.
2. Write the **pass record** (§A.7) to `.vsdd/pass-records/` — gate, artifacts (pinned by hash/SHA), reviewer + independence attestation, bundle manifest, objective evidence, findings, verdict, Architect approval, timestamp.
3. Once all findings are dispositioned and the record committed, the Architect runs `/vsdd-advance` to record the gate cleared.

## Gotchas

- **Evidence isolation is partial for an AI reviewer, and the gap is not closed by the bundle.** The export gives a *human* reviewer the §A.17 workspace and gives every gate an auditable manifest — but a subagent shares this filesystem and can read the withheld repository paths regardless of what its prompt contains. Curating the prompt and exporting the bundle are both necessary and still not sufficient here. Record the limit in the pass record rather than claiming isolation the harness cannot provide.
- A re-review after a FAIL needs a reviewer who did **not** run the prior pass on this artifact at this gate (§A.7).
- If a finding routes upstream (a requirements gap at Gate 4), it returns to the owning phase and **cascade-invalidates** downstream pass records (Phase 5) — see `vsdd-phase-5-feedback`.
- A clean first-pass verdict is `PASS_CLEAN` with the "Forced to manufacture flaws." invariant. A **context-free re-review emits the same invariant** — it has no knowledge of prior rounds, so it cannot author "All prior findings resolved." The **record-level verdict is set from the gate's finding history**, not the reviewer's phrase: a gate that had prior findings closes `PASS_FIXED` (the Architect records that phrasing) even though the cold reviewer returned the `PASS_CLEAN` invariant (§A.7).
- A scope-affecting **disposition is not self-certifying**: after an Architect disposition that re-characterises scope or routes a finding (not a plain fix), re-run the cold adversary on the disposition's artifacts *together* (e.g. SRS+SDD) to re-validate consistency — the disposition can contradict an un-amended artifact (§A.8).
