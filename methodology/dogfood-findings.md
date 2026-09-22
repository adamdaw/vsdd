# VSDD dogfood findings — backlog

Findings surfaced by dogfooding the methodology + plugin on real projects, tracked until folded into
the methodology (`VSDD.md` / `appendix-a-schemas.md`) and/or the plugin (`plugin/`). **Folded** findings
move to `CHANGELOG.md` [Unreleased]; this file holds the index of what folded where, anything still
**pending**, and any limitation a finding folded *with* rather than closed. Nothing is pending as of
2026-09-22.

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

Plugin enforcement, folded 2026-09-22 in one design pass:

- **#8 / #9** — per-work-item phases/gates and the dependency DAG in `state.json` (`items`,
  `active_item`); an item's Gate 5 finishes the item and routes to the next ready one, and Phase 7
  gates on all items → `vsdd-advance`, `gate-check.js`, `vsdd` skill.
- **#5** — an epic's Gate 1 requires `work-items.md` + a committed decomposition-checkpoint pass
  record → `vsdd-advance`, `vsdd-phase-1-requirements`.
- **#2** — the admitted-only reviewer workspace is exported by tool, with a committed manifest and a
  leak check that destroys a tainted bundle → `/vsdd-bundle`, `vsdd-adversary`. **Folded with a
  limitation, not closed:** see below.

## Open limitation

**AI reviewer evidence isolation is partial (#2).** §A.17 requires the withheld paths to be *absent or
access-denied* in the workspace the Adversary can reach. `/vsdd-bundle` exports an admitted-only
workspace and proves the export excluded the withheld paths, which discharges §A.17 for a **human**
reviewer and gives every gate an auditable manifest. It does not discharge it for an **AI** reviewer: a
subagent shares the filesystem and can read withheld repository paths regardless of its prompt or its
working directory, and the harness offers no way to deny that. Closing this needs a sandbox the
reviewer cannot read around — a container, or a harness that can restrict a subagent's file access.
Until then a gate's pass record should state that its isolation was bundle-and-prompt, not enforced.
