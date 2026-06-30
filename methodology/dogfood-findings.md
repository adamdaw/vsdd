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
   **Sharpened 2026-06-29 (WI-1 Gate 5):** the limitation isn't just non-modelling — it emits a *wrong
   action*. `/vsdd-advance` past the FIRST work-item's Gate 5 set the project to `phase 7` and prompted
   "commit the Phase 7 convergence roll-up record" — false epic-convergence when only WI-1's vertical was
   done (WI-2…4 unstarted). Fix: in a multi-WI epic, advancing past a WI's Gate 5 must route to the next
   WI's Phase 2 per the `work-items.md` DAG, NOT to epic Phase 7; Phase 7 gates on ALL WIs cleared.
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

### From GitNexus-Apex, Phase 4–6 / WI-1 Gates 4–5 (2026-06-29) — NEW

16. **Coverage pins must respect the host's measurement architecture.** SDD-001 §3 set a ≥80%-lines floor
    on `languages/apex/**`, but the integration suite runs the provider configs inside a parse
    **worker_thread from compiled `dist/`**, which main-thread v8 instrumentation cannot see — so scoped
    coverage read ~16% and the SHALL looked unmeasurable. It is NOT a waiver case: the fix is **main-thread
    unit anchors** that parse in-process and call the provider's pure functions directly, making the logic
    coverage-attributable (lifted to ~92%). Bake into §A.11 SDD-authoring guidance: when integration runs
    off-thread (workers, subprocesses, compiled output), require unit anchors so a coverage pin is
    measurable, and don't let a worker-thread architecture masquerade as an unmeetable target.

17. **Case-insensitive-keyword languages: handle keyword casing at PARSE, separately from identifier
    case-insensitivity at RESOLUTION.** WI-1 deferred "case-insensitivity → WI-2 resolver" — but that
    deferral is about *identifier* folding (matching `myMethod`↔`MyMethod` references). *Keyword/modifier*
    casing is a different axis and a WI-1 **parse-correctness** concern: Apex is case-insensitive and the
    grammar preserves source case, so a case-sensitive lowercase modifier match silently mis-classified
    `webService`/`Public`/`GLOBAL` node attributes (`isExported`, static, final, visibility). Caught only
    at Gate 4 Pass 2. Lesson: a "defer case-insensitivity" decision must name *which* axis (lexical-keyword
    vs identifier-resolution); conflating them leaves a real parse bug latent. Sibling: the Gate-4 adversary
    catching two genuine WI-1 parse-correctness bugs (annotation-argument export mis-bucketing; this one)
    validates the context-free Pass-2 code reviewer as a real defect gate, not a rubber stamp (reinforces
    #6).

### From GitNexus-Apex, WI-2 Phase 2 / Gate 2 (2026-06-29) — NEW

18. **A documented Architect disposition can itself be internally incomplete — re-run the cold adversary
    AFTER a disposition, not just after a fix.** On WI-2's REQ-008, the Architect ratified option (a)
    ("benchmark-parity scoping, no SRS amendment needed"). Two cold rounds later the adversary proved that
    disposition contradicted the un-amended SRS §9 Gherkin (whose `Then` still demanded a resolved edge the
    host emits for no language) — forcing the SRS v1.2 amendment (a) had claimed unnecessary. A finding-#13
    sibling: the Architect reasons from *intent* and can miss an artifact-level inconsistency that the cold,
    evidence-isolated adversary catches. **Fix:** after any disposition that re-characterises scope or
    routes a finding, the next adversary round must read the disposition's artifacts together (SRS+SDD) and
    re-validate consistency — the disposition is not self-certifying.

19. **Host-API-heavy work items need many cold rounds + the §A.6 spike up front; budget for it.** WI-2
    (resolution mechanics) took **12** cold Gate-2 rounds to converge (vs WI-1's far fewer), every round a
    legitimate fixed-only finding — driven by the REQ-008 selection-algorithm amendment and the resolution
    layer's large host-API surface. The §A.6 spike (RESEARCH-002) up front pre-empted the finding-#13 trap
    (it proved case-insensitive resolution needs a generic §2.2 seam, option b infeasible — a pin that would
    otherwise have detonated at Gate 3). Lesson for the methodology/plugin: flag host-API-heavy WIs at
    decomposition, mandate the §A.6 host-behaviour spike before SDD authoring, and expect (don't truncate)
    a long cold loop — the convergence is real, not loop thrash.

### From GitNexus-Apex, WI-2 Phase 3 Step 3b / resolution implementation (2026-06-30) — NEW

20. **A [Gate-3 reliance] can be found FALSE at Step 3b — clarify the spec, don't force a beyond-parity
    capability (finding #13 recurring).** SDD-002 §2 tagged "the host reference pass emits the `USES` edge
    to the type node" (REQ-005 type usage) as a [Gate-3 reliance], per the finding-#13 discipline. Step-3b
    implementation evidence: NO benchmark language emits a `USES` edge for a plain declared type
    (`Account a;`) — building one would EXCEED the stated parity target. The Architect clarified the SDD
    (type-usage resolution = the declared type binding the variable's type, which drives receiver typing —
    not a standalone edge) rather than build the beyond-parity capability. **Lesson:** the finding-#13
    flag→Gate-3 mechanism works in BOTH directions — a flagged host-API behaviour can turn out to be
    *absent* (host does less than the spec assumed), and the correct resolution is an Architect-approved SDD
    clarification (a Phase-5 loop-back), exactly as when it turns out *present-but-different*. Bake into the
    Gate-3/§A.11 guidance: a [Gate-3 reliance] resolving FALSE is a normal, expected outcome, not a defect.

21. **A cross-cutting language capability folds through MULTIPLE independent keyspaces — enumerate them all,
    fold symmetrically, or you get same-input-works/variant-fails bugs.** Apex case-insensitive resolution
    needed a generic `normalizeIdentifier` seam (the §A.6 spike correctly predicted ONE seam), but the host
    actually keys names in ≥3 INDEPENDENT places that each had to be folded symmetrically: the member
    registries (parse-time register + resolution-time lookup), the scope-extractor's declaration bindings
    (a separate class-name keyspace), and the scope-resolution `reconcile-ownership` re-registration (which
    re-keys members under a different owner id). Folding only the obvious one produced a long tail of
    partial bugs (same-case-works/case-varied-fails; split case-collisions). **Lesson for §A.6 spikes on
    host-API-heavy seams:** the spike should trace EVERY keyspace the capability touches (not just the
    first), and the SDD should enumerate them as the seam surface — under-counting the keyspaces is a
    finding-#13-class miss that only surfaces at Step 3b. Identity-for-peers default keeps it NFR-002-safe.

22. **Conservatism (a "leave-unresolved" REQ) lives in EVERY resolution path, not one — a single flag is
    insufficient.** REQ-015 (Apex: undisambiguable → unresolved, never guess) had to be enforced in THREE
    distinct host paths that each independently fell back to a best-guess first-match: receiver-bound
    overload resolution, the free-call/implicit-`this` path (unqualified self-calls bypass the receiver
    path entirely), and case-only member-collision. A generic `conservativeOverloadResolution` flag covered
    two; the collision needed a separate `resolveReceiverMember` ambiguity hook. **Lesson:** when an SDD
    pins a conservative/"degrade-not-lie" REQ, audit ALL resolution entry points for their independent
    best-guess fallbacks — the Gate-3 fixtures should exercise each path shape (qualified vs unqualified
    call, method vs field, exact-miss vs multi-match), or some paths ship non-conservative.
