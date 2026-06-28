# Changelog

All notable changes to the VSDD methodology are recorded here.

## [Unreleased]

### Added
- **Phase 1 — Requirements Refinement (SRS)** front-end (Socratic deliberation → tiered SRS → Gate 1 SRS Fidelity); renumber to seven phases / five gates.
- "Mockups as elicitation" in Phase 1 (throwaway HTML/CSS prototypes as a requirements aid).
- **Appendix A — Normative Schemas**: CSDD clause schema (§A.1), Constitution template + amendment process (§A.2), provable-property decision table (§A.3), fuzzing policy (§A.4), dependency/CVE review policy (§A.5), and the Research-artifact definition (§A.6) — each linked from its point of use in the methodology.
- Bounded edge-case checklist; operational "security-critical" tag; the Intent artifact definition.
- **Test scaffolding** — a second pre-Gate-3 hook exemption (distinct from the no-red justification) for the brownfield capability-addition case: the minimum non-functional code needed to make a target test *executable-red* (e.g. vendoring a grammar + registering a language). Governed by an outcome-based discriminator — an edit is scaffolding iff it greens no *behavioural* target test (a test deriving from a behavioural REQ; infrastructure-presence tests, e.g. "the grammar manifest carries this entry," may green, since vendoring a third-party asset + its registration is rung-3 build/infra) — tagged `// vsdd:scaffold`, recorded in a scaffold ledger with red-stays-red evidence, permitted by the hook, and verified at Gate 3 (the `vsdd-advance` tool refuses Gate 3 without the ledger; the Adversary checks the tagged diffs). Surfaced by the first plugin dogfood (GitNexus-Apex), which also stress-tested the discriminator: it initially over-fired on an infra-presence test, refined to target behavioural tests only.

### Changed
- Made the five derivation gates map onto real pipeline steps: a dedicated **Gate 3** test review *before* implementation; Pass 1 reviews implementation against spec **and** tests (Gate 4); **Gate 5** reframed as the deterministic verification gate (prover = adversary).
- Redefined convergence as committed evidence + an explicit Architect sign-off on **every** remaining finding (adversary or tool) — no severity auto-pass.
- Narrowed "actor-agnostic" to the execution roles; the Architect is the non-delegable human authority.
- **Restricted the no-red justification to a narrow residual.** Recast Principle 3's TDD exemption as an ordered ladder (test it → scaffold it → Gate 5/Constitution → §A.10), with no-red reachable only as the last resort for a platform-mandated inert construct; the justification must name which rungs it ruled out (no bare one-liner), and the adversary checks the disposition. Prevents the catch-all from absorbing cases that are now better classified — especially test scaffolding.

### Fixed
- Citation-integrity pass: removed two unsupported citations, recast two as analogy/hypothesis, and corrected a misattributed statistic — each verified against its primary source.
