# Changelog

All notable changes to the VSDD methodology are recorded here.

## [Unreleased]

### Added
- **Phase 1 — Requirements Refinement (SRS)** front-end (Socratic deliberation → tiered SRS → Gate 1 SRS Fidelity); renumber to seven phases / five gates.
- "Mockups as elicitation" in Phase 1 (throwaway HTML/CSS prototypes as a requirements aid).
- **Appendix A — Normative Schemas**: CSDD clause schema (§A.1), Constitution template + amendment process (§A.2), provable-property decision table (§A.3), fuzzing policy (§A.4), dependency/CVE review policy (§A.5), and the Research-artifact definition (§A.6) — each linked from its point of use in the methodology.
- Bounded edge-case checklist; operational "security-critical" tag; the Intent artifact definition.

### Changed
- Made the five derivation gates map onto real pipeline steps: a dedicated **Gate 3** test review *before* implementation; Pass 1 reviews implementation against spec **and** tests (Gate 4); **Gate 5** reframed as the deterministic verification gate (prover = adversary).
- Redefined convergence as committed evidence + an explicit Architect sign-off on **every** remaining finding (adversary or tool) — no severity auto-pass.
- Narrowed "actor-agnostic" to the execution roles; the Architect is the non-delegable human authority.

### Fixed
- Citation-integrity pass: removed two unsupported citations, recast two as analogy/hypothesis, and corrected a misattributed statistic — each verified against its primary source.
