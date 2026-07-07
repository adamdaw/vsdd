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

### From GitNexus-Apex, WI-2 Phase 4 / Gate 4 (2026-06-30) — NEW

23. **Constitution "absolute no-naming" isolation rules are too literal vs real host conventions — scope
    the ban to LOGIC/BRANCHING, not comments.** The Apex Constitution §2.1/§2.2 said shared code "MUST NOT
    name Apex" and called it "absolute". A Gate-4 Pass-1 cold reviewer flagged ~9 *comment* sites in shared
    seams that name "Apex"; a different cold reviewer read the same code as conformant. The split was in the
    Constitution text, not the code: the host's own shared files pervasively name C++/Python/Java/Kotlin/
    PHP/Ruby in explanatory comments, and the rule's RFC #909 / coupling target (no per-language *branch* in
    shared logic) was genuinely met (no `language === X`). Amended to v1.1.1: isolation = no language-specific
    *logic/branching*; naming an example consumer in a comment is permitted. **Lesson:** an isolation/naming
    Constitution rule should prohibit *coupling* (branches/identifiers in executable paths), not lexical
    occurrences; "absolute" wording invites a reviewer split on comments. Sibling to #14 (over-absolute §2.2).

24. **Context-free re-review cannot emit the "All prior findings resolved" PASS_FIXED phrase — it has no
    knowledge of prior rounds, so a clean re-review yields PASS_CLEAN's "Forced to manufacture flaws".** The
    `vsdd-adversary` skill says a clean *re-review* is PASS_FIXED ("All prior findings resolved") vs a clean
    *first pass* is PASS_CLEAN ("Forced to manufacture flaws"). But genuine production-independence (a fresh
    agent with no producer-session access, the §A.17 ideal) means the re-reviewer literally cannot know there
    *were* prior findings — so it emits the PASS_CLEAN invariant even on round 8. The phrase distinction
    assumes a *memory reset* (same reviewer, fresh window), not *production independence* (different invocation).
    **Fix:** the gate-record verdict is determined by the GATE's history (had findings → PASS_FIXED), not the
    reviewer's phrase; document that a context-free re-review's "Forced to manufacture flaws" maps to
    PASS_FIXED at the record level. Reconcile §A.7's phrasing with the cold-loop independence model.

25. **Fix-induced drift is real AND deep — re-review after EVERY fix, context-free, is load-bearing (extends
    #3).** WI-2 Gate-4 Pass 1 took 8 cold rounds to converge (6→2→2→2→3→4→2→clean). Two catches justified the
    whole loop: round 2 found an SDD §1/§2/§3 body contradiction (a superseded "USES edge" requirement) that
    round 1 AND the Builder both missed; round 7 surfaced a REQ-008 argument-typing scope boundary that
    reshaped work-item ownership. Each fix also exposed the next inert residue (a removed hoist exposed an
    unused accumulation, etc.). **Lesson:** a single adversarial pass is insufficient for a large adapter diff;
    budget for a multi-round cold loop, and never treat "the reviewer passed once" as convergence — clean
    means a fresh reviewer round with zero legitimate findings.

26. **A Gate-4 fidelity finding can reveal an inter-WI scope boundary needing explicit ownership: "deferred
    COMPLETION, not co-ownership".** Pass 1 flagged that REQ-008's "narrow by the argument's static type"
    was unrealized for a method-*parameter* used as an argument. The fix wasn't "build it" or "just disclose":
    tracing the acceptance fixtures showed that typing parameter args safely requires distinguishing
    user-defined from EXTERNAL parameter types — a capability owned by a *later* work item (external-type
    detection). So the narrowing was specified as that later WI's **completion** of a REQ the current WI still
    owns — mirroring how a cross-file-enabler WI completes an earlier WI's same-file mechanics. **Lesson:** the
    decomposition/coverage-map layer needs a first-class "WI-B completes a sub-case of WI-A's REQ (needs WI-B's
    capability), without co-owning the REQ" relationship — distinct from ownership and from a plain dependency.
    Surfaced only because the Architect rejected a "disclose and defer" framing as lazy, forcing the trace
    that revealed the principled boundary.

27. **A non-parse work item's Gate 5 fuzzes its OWN owned stage, not reflexively the SECT trust boundary.**
    WI-1's Gate 5 was documented as "the template" (fuzz `parseSourceSafe` — the SECT-001 untrusted-input
    boundary — + mutation + purity). But WI-2 (resolution mechanics) introduces **no new parse path**: it
    consumes WI-1's safe-parsed output, so re-fuzzing `parseSourceSafe` would be pure redundancy (already
    discharged at WI-1 Gate 5) and would exercise *none* of WI-2's owned code. The correct WI-2 fuzz target
    was its own owned surface — `emitApexScopeCaptures`, the resolution capture pipeline (free/member
    classification, receiver-binding synth, arity, arg-type inference, the JSON.parse var-binding paths,
    inheritance/ctor synth) — driven on adversarial/error-recovery trees per the NFR-001 *resolution-stage*
    slice (resolution completes, refs left unresolved, never a throw). **Lesson:** Gate 5's fuzz obligation is
    "saturate the WI's owned risk surface," not "re-run the SECT-boundary corpus." For a security-critical WI
    that owns a trust boundary, those coincide; for a downstream WI they diverge. The Phase-6 guidance should
    say: identify the WI's owned executable surface and the cross-cutting NFR slice it carries (here NFR-001's
    resolution-path slice), and fuzz *that* — a template is a shape (corpus + bounded smoke-fuzz + mutation +
    purity), not a fixed target. Mutation scope likewise narrows to the WI's own decision logic (WI-1's parse
    configs were already audited at WI-1 Gate 5).

28. **A host-integration / cross-file WI's SDD Gate 2 can take 15–20 cold rounds — and the loop is
    load-bearing, not ceremony.** WI-3 (Apex cross-file binding) cleared Gate 2 after a **17-round** cold
    context-free loop (16 rounds of findings → 1 clean; ~86 findings; finding-counts
    7·8·7·9·6·7·6·5·7·6·9·4·4·2·2·1·clean). The core design (register the host's `populateNamespaceSiblings`
    seam) was sound from round 1; the length came from the deep edge-case surface of import-less cross-file
    resolution over *uncompiled* source (misfiled types, re-parented malformed fragments, duplicate names,
    cross-language key collisions, nested-type access, trigger static/instance receivers) and the
    verification-split rigor (every [structural] pin must trace to admitted spike evidence). **Lesson:** for a
    WI that integrates deeply with host-API behaviour, budget many cold rounds; watch the finding-count
    *trend* (a steady decline = convergence, not thrashing) rather than the round number. The methodology
    should set the expectation (host-integration SDDs are Gate-2-heavy) so a Builder/Architect doesn't
    mistake a long-but-converging loop for a stuck one, or bank early.

29. **"Commit a mechanism to satisfy the SHALL — never silently de-scope" (Constitution §7 at the SDD layer).**
    The adversary repeatedly caught cross-file completions (nested-type `Outer.Inner` access, cross-file
    inherited members, non-exported-type resolution) being quietly left to "conservative-unresolved." But each
    is an *unambiguous user-defined reference* a SHALL requires resolving — so leaving it unresolved is an
    **unsanctioned requirement reduction**, distinct from legitimate conservatism-under-*ambiguity* (which
    governs only genuinely ambiguous refs). The fix pattern that converged: every such completion carries a
    **named committed fallback** (an Apex-local addition engaged only if its Gate-3 fixture is red), so the
    SHALL has a satisfaction path — the SDD may not silently reduce a requirement, only the Architect via an
    SRS amendment may. Bake the "un/ambiguous" distinction and the committed-fallback requirement into the
    SDD-authoring + Gate-2 adversary guidance.

30. **The cold loop is a check on the ARCHITECT too — and a persistent finding-stream signals over-engineering.**
    When the Architect asked "can we check validity?" for a malformed-fragment collision, the Builder built a
    clever parse-cleanliness *tiebreaker* (pick the clean-parsed def as winner; needed a new §2.2 seam). The
    cold loop flagged it as **invention-beyond-parity** (Constitution §1): picking a winner is a
    liveness-increasing heuristic with no benchmark anchor (peers don't re-parent), and it kept generating
    downstream findings (evidence needs, framing contradictions, a §1.2-term misuse). The resolution was to
    **revert to the simplest conservative rule** (REQ-015 inject-none + a documented §A.13 liveness
    limitation) — which dropped the seam entirely. **Lessons:** (a) the adversary validates the *design*, not
    just the Builder's fidelity to it — an Architect-approved "make it better" direction can itself be wrong,
    and the loop catches it; (b) a mechanism that keeps spawning findings round after round is a smell of
    over-engineering — prefer the simplest conservative primitive the requirement actually asks for. Permacomputing
    "Not Doing" / parity-not-invention, operationalised by the loop.

31. **A clarification ratified for one REQ may need PARALLEL ratification for a sibling REQ sharing the pattern.**
    REQ-005 got a v1.3 clarification (a bare declared-type usage = a *binding*, not a standalone edge — parity).
    At WI-3 Gate 2 the adversary found REQ-011's "type" arm still literally demanded a resolved edge for the
    same bare-type-usage shape (in a trigger body) — so declining the edge there was applying a clarification
    ratified only for REQ-005. Fix: **SRS amendment v1.4** propagating the same clarification to REQ-011.
    **Lesson:** when an amendment clarifies a *cross-cutting behaviour* (here: how a reference *kind* resolves),
    grep the SRS for sibling REQs that reference the same kind and ratify them together, or the gap surfaces at
    a later WI's gate. The methodology's amendment step should prompt a sibling-REQ sweep.

### From GitNexus-Apex, WI-3 Gates 4–6 (2026-07-06/07) — NEW

32. **A clean FIRST cold pass is legitimate convergence when the implementation is byte-stable since a prior
    cleared gate — do NOT treat "passed once" as suspect *here* (refines #25).** #25's lesson ("never treat
    one pass as convergence; budget a multi-round cold loop") was drawn from a *large fresh adapter diff*
    where every fix exposed the next residue. WI-3 Gate-4 Pass-1 (spec-fidelity) instead returned
    **PASS_CLEAN on the first cold pass** — legitimately: the impl bytes had not changed since increment 15
    (the cross-file logic cleared its earlier gates unchanged), so there was no drift for a second round to
    find. The discriminator is **impl byte-stability**: when the reviewed artifact is unchanged since a
    distinct reviewer last cleared it, one clean cold pass by a *different* reviewer IS termination (§A.7);
    forcing extra rounds against a stable artifact is loop-thrash hunting phantom drift. **Fix:** the Gate-4 /
    §A.7 termination guidance should state both directions — a *fresh/large* diff expects a multi-round cold
    loop (#25), a *byte-stable* impl can converge on one clean cold pass — and the record should pin the impl
    SHA so byte-stability is checkable, not asserted. Sibling to #25 (its complementary case).

33. **Phase 6 (Gate 5) — the owned risk surface splits into a fuzz-reachable part and a mutation/suite-hardened
    part; and a zero-branch plumbing file is covered transitively, not by a manufactured mutant (extends #27).**
    #27 established "fuzz the WI's OWN owned surface, not the SECT boundary." WI-3 sharpened two sub-points:
    - **Fuzz target = the in-process-reachable owned entry only; harden the rest by mutation + green suite +
      purity, and say so.** WI-3's owned surface spans the capture emitter (`emitApexScopeCaptures`,
      directly fuzz-reachable) AND seven shared resolution-pass edits that run *inside the scope-resolution
      pipeline* — not reachable by an in-process fuzz of the capture entry. The correct move is to fuzz the
      reachable entry (26-input adversarial corpus + bounded smoke-fuzz, seed `0x5f3ac003`) and explicitly
      state in the pass record that the unreachable passes are hardened by the mutation audit + the full green
      suite + the purity audit — an **honest scope statement, not a coverage gap**. A Phase-6 obligation is
      "saturate the owned surface by the *appropriate* deterministic tool per sub-region," not "fuzz
      everything."
    - **A pure-threading (zero-branch) file is covered transitively — document which downstream mutant kills
      its contribution rather than manufacturing a mutant.** 3 of WI-3's 12 files carry no independent
      decision logic (they thread a value through). Instead of inventing a meaningless mutant, the audit
      records that the sites they feed already kill their contribution (the normalizer thread dies with the
      lookup mutant, the MRO-flag thread with the free-call mutant, the interface-toggle with the contract
      mutant). This is honest scope, not a gap — a manufactured mutant on a branchless file proves nothing.
    - **Manual mutation exception when the host ships no mutation tooling.** GitNexus has no Stryker; the
      Constitution-designated manual audit discharges it deterministically: apply mutant → build → run the
      WI's targeted tests → confirm killed (non-zero exit) → `git checkout` revert; the throwaway patch is
      never committed (only the mutant table in the pass record is). The PRNG **seed is the reproducible
      corpus** (no `Math.random`/`Date.now` — a purity requirement the audit itself must satisfy). Bake the
      surface-split + transitive-coverage + no-tooling-manual-exception shapes into the Phase-6 / Gate-5
      guidance.
