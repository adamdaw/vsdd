# Changelog

All notable changes to the VSDD methodology are recorded here.

## [Unreleased]

### Added
- **Phase 1 — Requirements Refinement (SRS)** front-end (Socratic deliberation → tiered SRS → Gate 1 SRS Fidelity); renumber to seven phases / five gates.
- "Mockups as elicitation" in Phase 1 (throwaway HTML/CSS prototypes as a requirements aid).
- **Appendix A — Normative Schemas**: CSDD clause schema (§A.1), Constitution template + amendment process (§A.2), provable-property decision table (§A.3), fuzzing policy (§A.4), dependency/CVE review policy (§A.5), and the Research-artifact definition (§A.6) — each linked from its point of use in the methodology.
- Bounded edge-case checklist; operational "security-critical" tag; the Intent artifact definition.
- **Test scaffolding** — a second pre-Gate-3 hook exemption (distinct from the no-red justification) for the brownfield capability-addition case: the minimum non-functional code needed to make a target test *executable-red* (e.g. vendoring a grammar + registering a language). Governed by an outcome-based discriminator — an edit is scaffolding iff it greens no *behavioural* target test (a test deriving from a behavioural REQ; infrastructure-presence tests, e.g. "the grammar manifest carries this entry," may green, since vendoring a third-party asset + its registration is rung-3 build/infra) — tagged `// vsdd:scaffold`, recorded in a scaffold ledger with red-stays-red evidence, permitted by the hook, and verified at Gate 3 (the `vsdd-advance` tool refuses Gate 3 without the ledger; the Adversary checks the tagged diffs). Surfaced by the first plugin dogfood (GitNexus-Apex), which also stress-tested the discriminator: it initially over-fired on an infra-presence test, refined to target behavioural tests only.
- **External / unowned-component reliances** (§A.11, Phase 2c, `vsdd-adversary`) — a behavioural claim about a component the work item does not own (a third-party library, framework or host API, external service, or peer module) is marked `[Gate-3 reliance]`, traced to the SRS or an admitted §A.6 spike, never asserted as a Gate-2 design pin; the Gate-2 Adversary is evidence-isolated from that component and must not invent or affirm its design. A reliance may resolve FALSE at Gate 3 (a normal Phase-5 clarification, not a defect); a SHALL depending on one carries a **named committed fallback**. Surfaced by GitNexus-Apex (dogfood #7/#13/#20/#29).
- **External-behaviour spikes** (§A.6) — an externally-dependent work item runs a mandatory §A.6 spike before SDD authoring, tracing *every* keyspace a cross-cutting capability touches; a long cold Gate-2 loop is expected (read the finding-count trend, not the round number). (#19/#21)
- **Completion links** (§A.9) — "ITEM-B completes a sub-case of ITEM-A's REQ" as a first-class relationship distinct from ownership and from a plain dependency; and a deferral of a cross-cutting property must name the *axis* deferred. (#26/#17)
- **Fuzz the owned surface + manual mutation audit** (§A.4, Phase 6) — fuzz the work item's own owned surface rather than reflexively a shared trust boundary; an honest fuzz-reachable / mutation-hardened surface split; transitive coverage for zero-branch plumbing files; and a deterministic manual mutation audit (seed = reproducible corpus) where the host ships no mutation tooling. (#27/#33)

### Changed
- Made the five derivation gates map onto real pipeline steps: a dedicated **Gate 3** test review *before* implementation; Pass 1 reviews implementation against spec **and** tests (Gate 4); **Gate 5** reframed as the deterministic verification gate (prover = adversary).
- Redefined convergence as committed evidence + an explicit Architect sign-off on **every** remaining finding (adversary or tool) — no severity auto-pass.
- Narrowed "actor-agnostic" to the execution roles; the Architect is the non-delegable human authority.
- **Restricted the no-red justification to a narrow residual.** Recast Principle 3's TDD exemption as an ordered ladder (test it → scaffold it → Gate 5/Constitution → §A.10), with no-red reachable only as the last resort for a platform-mandated inert construct; the justification must name which rungs it ruled out (no bare one-liner), and the adversary checks the disposition. Prevents the catch-all from absorbing cases that are now better classified — especially test scaffolding.
- **Verdict is set by gate history, not the reviewer's phrase** (§A.7, §II, `vsdd-adversary`) — a context-free re-review emits the `PASS_CLEAN` invariant (it has no knowledge of prior rounds); the record-level `PASS_FIXED` is recorded by the Architect from the gate's finding history. Resolves the prior contradiction that a genuinely context-free reviewer could author "All prior findings resolved." (#24)
- **Cold-loop termination discriminator** (§A.7) — a fresh/large diff expects a multi-round cold loop (re-review after *every* fix); a byte-stable implementation (pinned SHA unchanged since a distinct reviewer cleared it) converges on one clean cold pass. (#3/#25/#32)
- **A disposition is not self-certifying** (§A.8, Phase 5) — after a scope-affecting Architect disposition, re-run the cold adversary on the artifacts *together* (SRS+SDD), not only after a code fix. (#18)
- **Isolation / no-naming Constitution rules** scoped to *coupling in executable paths*, not lexical occurrences in comments; generic language-/variant-agnostic seams permitted for capability-additions (§A.2). (#14/#23)
- **Amendment sibling-REQ sweep** (§A.2) — a cross-cutting clarification sweeps the SRS/SDD for sibling requirements and ratifies them together. (#31)
- **Off-thread coverage** (§A.2) — code under a coverage pin that runs off the main thread needs main-thread unit anchors; an off-thread architecture makes a pin unmeasured, never unmeetable or waivable. (#16)
- **Conservative-requirement enforcement** (Phase 3 / Gate 3) — a degrade-don't-lie requirement is enforced at *every* independent code path, with fixtures exercising each path shape. (#22)
- **Phase 5 is not an end-phase** (Phase 5, `vsdd` / `vsdd-phase-5-feedback`) — clarified as the always-on routing/cascade loop invoked whenever a finding must be integrated, distinct from Phase 7; and the cold loop checks the *Architect* (a persistent finding-stream is an over-engineering smell). (#15/#30)
- **Brownfield `vsdd-init`** (`vsdd` skill) — documented that the greenfield artifact map needs hand-editing for a fork or capability-addition. (#1)
- **Context-free adversary enforced in all phases** — reconciled: the `vsdd-adversary` skill and §A.7/§A.17/§II already enforce distinct-invocation, admitted-bundle-only independence across every gate. (#6, now closed)

### Fixed
- Citation-integrity pass: removed two unsupported citations, recast two as analogy/hypothesis, and corrected a misattributed statistic — each verified against its primary source.
