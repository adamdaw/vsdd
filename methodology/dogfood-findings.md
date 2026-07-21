# VSDD dogfood findings — backlog

Findings surfaced by dogfooding the methodology + plugin on real projects, tracked until folded into
the methodology (`VSDD.md` / `appendix-a-schemas.md`) and/or the plugin (`plugin/`). **Folded** findings
move to `CHANGELOG.md` [Unreleased]; this file holds what is still **pending**.

Sources: `commissionCalc` (original pipeline run), **GitNexus-Apex** (first plugin dogfood — `~/Projects/Home/gitnexus/.vsdd/HANDOFF.md`).

## Folded (see CHANGELOG [Unreleased])

Methodology + skill text, folded 2026-07-21 unless noted:

- **#3 / #25 / #32** — cold-loop termination discriminator (re-review after every fix on a fresh diff;
  byte-stable impl converges on one clean cold pass) → §A.7.
- **#6** — context-free adversary enforced in all phases (reconciled: already enforced in `vsdd-adversary`
  + §A.7/§A.17/§II).
- **#7 / #13 / #20 / #29** — external / unowned-component reliances marked `[Gate-3 reliance]` not pinned;
  Gate-2 Adversary must not invent/affirm an unowned component's design; a reliance may resolve FALSE at
  Gate 3; named committed fallback; conservatism vs silent requirement reduction → §A.11, Phase 2c,
  `vsdd-adversary`.
- **#10 / #11 / #12** — test-scaffolding category + behavioural-target discriminator; hook-wiring fix
  (folded earlier).
- **#14 / #23** — isolation / no-naming Constitution rules scoped to coupling in executable paths, not
  comments; generic language-agnostic seams for capability-additions → §A.2.
- **#15 / #30** — Phase 5 is not an end-phase (always-on routing loop); the cold loop checks the Architect
  (over-engineering smell) → Phase 5, `vsdd` / `vsdd-phase-5-feedback`.
- **#16** — off-thread coverage needs main-thread unit anchors (unmeasured ≠ unmeetable/waivable) → §A.2.
- **#17 / #26** — a deferral of a cross-cutting property must name the axis; completion links
  ("ITEM-B completes a sub-case of ITEM-A's REQ") → §A.9.
- **#18** — a scope-affecting disposition is not self-certifying; re-run the cold adversary on the
  artifacts together → §A.8, Phase 5.
- **#19 / #21** — externally-dependent items flagged at decomposition; mandatory §A.6 external-behaviour
  spike tracing every keyspace; expect a long cold Gate-2 loop → §A.6, §A.9.
- **#22** — a conservative / degrade-don't-lie requirement is enforced at every independent code path,
  fixtures exercising each shape → Phase 3 / Gate 3.
- **#24** — verdict set by gate history, not the reviewer's phrase (context-free re-review emits the
  `PASS_CLEAN` invariant) → §A.7, §II, `vsdd-adversary`.
- **#27 / #33** — fuzz the WI's own owned surface (not a shared trust boundary); fuzz-reachable /
  mutation-hardened surface split; transitive coverage for zero-branch files; manual mutation audit where
  the host ships no tooling → §A.4, Phase 6.
- **#31** — amendment step sweeps the SRS/SDD for sibling REQs sharing a cross-cutting clarification → §A.2.
- **#1** — brownfield `vsdd-init` artifact map needs hand-editing (documented) → `vsdd` skill.

## Pending — plugin enforcement (needs a design decision)

The **methodology** side of each of these is folded; what remains is **plugin enforcement** — the plugin's
state machine and reviewer-sandbox do not yet *mechanically* enforce what the methodology now specifies.
This is a coherent design pass on the plugin, deferred pending Architect decisions on how much to build.

- **#2 — Reviewer evidence-isolation is a real sandbox in the methodology (§A.17) but instruction-based in
  the plugin.** `vsdd-adversary` tells the operator to "read the admitted files yourself, then pass their
  paths/contents to the reviewer" — it does not *export an admitted-only workspace* with the withheld paths
  absent/access-denied. Decision: build a genuine sandbox export (worktree/checkout/archive of admitted
  paths only) the adversary agent runs against, vs. keep the instruction-based bundle.

- **#5 — Decomposition checkpoint is unenforced in `vsdd-advance`.** The methodology gates the epic →
  work-item decomposition at a Gate-1 checkpoint (§A.7, §A.9); the plugin does not require the work-items
  artifact + a committed decomposition-checkpoint pass record before an item leaves Phase 1. Enforcing it
  depends on the plugin modelling epics at all (see #8/#9).

- **#8 — The project-level state machine emits a *wrong action* on multi-WI epics.** Advancing past the
  first work item's Gate 5 sets the project to `phase 7` and prompts for the epic convergence roll-up —
  false epic-convergence when only WI-1's vertical is done. The correct behaviour: in a multi-WI epic,
  advancing past a WI's Gate 5 routes to the next WI's Phase 2 per the `work-items.md` DAG; Phase 7 gates on
  ALL WIs cleared. (`state.json` currently models one project-level phase, not per-WI phases/gates.)

- **#9 — Epic execution is DAG-driven, not a binary mode.** Per-item/vertical vs batched/horizontal vs a
  combination, Architect-selectable per epic and per subgraph, driven by which risk dominates where. The
  state machine must model per-item phase/gates AND the dependency edges that gate parallelism.

**#8 and #9 are the same decision:** whether (and how far) to make the plugin's `.vsdd/state.json` +
`vsdd-advance` model per-work-item phases/gates and the dependency DAG. #5's enforcement and #2's sandbox
are the two other plugin-build decisions. All four are deferred to an Architect design pass, not folded.
