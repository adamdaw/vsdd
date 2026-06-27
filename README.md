# VSDD — Verified Spec-Driven Development

A gated software-engineering methodology — AI-orchestrated by default, but actor-agnostic in its execution roles — that fuses **Spec-Driven**, **Test-Driven**, and **Verification-Driven** Development into a single pipeline: seven phases, five derivation gates — an independent adversary at each derivation step, a deterministic verifier (with recorded manual exceptions) at the final one.

> The SRS defines *what*; the SDD defines the contract and architecture; tests enforce observable contract behaviour; adversarial verification surfaces what was missed.

## Read the methodology

- **[methodology/VSDD.md](methodology/VSDD.md)** — the full methodology.
- **[methodology/appendix-a-schemas.md](methodology/appendix-a-schemas.md)** — normative schemas & templates: CSDD security-clause schema, Constitution template, provable-property decision table, fuzzing and dependency/CVE policies, research artifact, the pass-record, finding/disposition, and work-item schemas, and the manual-acceptance evidence record (§A.1–A.10).
- **[methodology/citation-audit.md](methodology/citation-audit.md)** — every empirical citation checked against its primary source.

## The pipeline at a glance

| Phase | Gate after |
|---|---|
| 1 · Requirements Refinement → SRS | **Gate 1** · SRS Fidelity |
| 2 · Spec Crystallization → SDD | **Gate 2** · Spec Fidelity |
| 3 · Test Generation & TDD Implementation | **Gate 3** · Tests vs Spec *(internal — after tests, before code)* |
| 4 · Adversarial Refinement | **Gate 4** · Impl vs Spec + Tests (Pass 1) + quality/security/process/deps (Pass 2) |
| 5 · Feedback Integration | — |
| 6 · Formal Hardening | **Gate 5** · Verification *(proofs · fuzz · mutation · hardening · purity; predominantly deterministic)* |
| 7 · Convergence | — |

Gate 3 is *internal* to Phase 3 — after test generation, before implementation; the other gates fall at phase end.

Convergence is declared per dimension by committed evidence: every finding — adversary or tool, at any severity — is either resolved or carries an explicit, committed Architect sign-off. Two classes cannot be signed off: a CSDD MUST-security violation (fix or compliance-verify only) and an undischarged Prove-classified property (prove or re-architect). A MAY-level advisory is not a finding. There is no severity cutoff that lets a defect ship.

## Status

The methodology is actively used and refined on real project work. A Claude Code **plugin** that enforces the gates — per-phase skills, a state-driven `PreToolUse` hook, and restricted reviewer agents — is in development and will live in this repo.

## Provenance

Every empirical citation is checked against its primary source — see the [citation audit](methodology/citation-audit.md). The methodology has been reviewed adversarially, including by an independent different-model reviewer.

## License

[MIT](LICENSE) © 2026 Adam Daw.
