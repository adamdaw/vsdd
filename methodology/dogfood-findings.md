# VSDD dogfood findings — backlog

Findings surfaced by dogfooding the methodology + plugin on real projects, tracked until folded into
the methodology (`VSDD.md` / `appendix-a-schemas.md`) and/or the plugin (`plugin/`). **Folded** findings
move to `CHANGELOG.md` [Unreleased]; this file holds what is still **pending**.

Sources: `commissionCalc` (original pipeline run), **GitNexus-Apex** (first plugin dogfood — `~/Projects/Home/gitnexus/.vsdd/HANDOFF.md`).

## Folded (see CHANGELOG [Unreleased])

- **#10 Test-scaffolding category** + outcome-based discriminator (behavioural targets only).
- **#11 Hook wiring** — removed the stale `~/bin/vsdd-gate-check` prototype shadowing the plugin hook; synced the install cache.
- **#12 Discriminator scoped to behavioural targets** — infra-presence tests may green.

## Pending — to fold

### From GitNexus-Apex, Phase 1–2 (2026-06-28)

1. **`vsdd-init` is greenfield-shaped** — brownfield (a fork/host) needs custom artifact paths; hand-edited for Apex.
2. **Evidence isolation is instruction-based**, not a real exported sandbox (§A.17). Consider a genuine reviewer sandbox.
3. **Fix-induced drift is real** — re-review after every fix; the cold context-free loop catches it.
5. **Decomposition checkpoint is an unenforced Gate-1 sub-pass** — `vsdd-advance` past Gate 1 should require the work-items artifact + a committed decomposition-checkpoint pass record (epic only).
6. **Context-free adversary in ALL phases** — primed prompts rubber-stamp PASS; the clean prompt catches majors. Bake into `vsdd-adversary` (practised throughout Apex; not yet enforced in the skill).
7. **Gate-2 verification split** — an SDD must mark grammar/§A.6 facts (Gate-2-verified) vs host-API behaviours (Gate-3 design obligations). Bake into §A.11 SDD-authoring guidance. **See #13 — this split has a sharper failure mode than first recorded.**
8. **Per-item state** — project-level `state.json` doesn't model concurrent per-work-item phases/gates.
9. **Epic execution is DAG-driven, not a binary mode** — per-item/vertical vs batched/horizontal vs a combination, Architect-selectable per epic and per subgraph, driven by which risk dominates where. The state machine must model per-item phase/gates AND the dependency edges that gate parallelism.

### From GitNexus-Apex, Phase 3–5 (2026-06-29) — NEW

13. **Gate-2 evidence-isolation blind spot (the big one).** The Gate-2 adversary is evidence-isolated
    from the host codebase (correct, for spec-fidelity independence) — but that means it **cannot
    validate host-API *design* choices** and will reason them "on their own merits." On GitNexus-Apex the
    Gate-2 adversary *introduced* five host-API design pins (always-on/canonical id signature,
    case-normalised id, identical-signature positional disambiguator, owner cascade-drop, no-nested-
    `DEFINES`) that **diverged from the host's actual behaviour with no SRS basis**. They passed Gate 2
    PASS_CLEAN and only surfaced at Gate 3 (tests vs the real host), costing a full Phase-5 loop-back
    (SDD v1.1→v1.2, Constitution v1.0.0→v1.1.0, Gate 2 + Gate 3 re-clear).
    - **Fix:** the Gate-2 adversary (and the §A.11 SDD-authoring guidance / `vsdd-adversary` skill) must
      treat host-API behavioural claims as **Gate-3 reliances to FLAG, not pin** — the SDD should mark
      them and the Gate-2 adversary should *not* invent or affirm a host-API design it cannot verify. A
      Gate-2 "PASS" on a host-API design pin is unsound. This is the sharp edge of #7.
    - Secondary: consider giving the Gate-2 adversary read access to the *peer-language* implementations
      (not the WI's own code) when the WI is a capability-addition modelled on a peer, so it can sanity-
      check "is this how the host actually does it?" without breaking spec-fidelity isolation.

14. **Constitution §2.2 too absolute for capability-additions.** The template's "Registration, not pipeline
    edits — the parse/scope phases are not edited" assumed every needed seam already exists in the host.
    A from-scratch language has novel needs (member annotations on Property nodes, a node-kind marker, a
    degenerate-node guard) that require **new generic, language-agnostic seams** in shared factories/phases.
    Amended in the Apex Constitution to v1.1.0: generic seams permitted where no host seam exists, provided
    they name no language and regress no other language (measured); §2.1's no-naming ban stays absolute.
    **Ship the refined §2.2 in the Constitution template (§A.2).**

15. **Phase 5 ≠ end-phase (clarify in VSDD.md).** Phase 5 (Feedback Integration) is the always-on
    routing/cascade-invalidation loop invoked *whenever* a finding must be integrated — NOT a step that
    waits for all work items (that is Phase 7 Convergence). A Phase-3 Builder finding loops back to its
    owning gate in-loop (on Apex: Gate 2, SDD-only, since the SRS pinned none of the reverted designs),
    cascade-invalidating the superseded Gate-2/Gate-3 pass records. The methodology wording should make
    explicit that "route to owning phase + cascade-invalidate" IS the in-loop loop-back, available at any
    phase, not deferred.
