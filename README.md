# VSDD — Verified Spec-Driven Development

A gated software-engineering methodology — AI-orchestrated by default, but actor-agnostic in its execution roles — that fuses **Spec-Driven**, **Test-Driven**, and **Verification-Driven** Development into a single pipeline: seven phases and **five numbered gates** — an independent adversary runs the derivation-fidelity checks (Gates 1–3 and Gate 4 Pass 1), Gate 4 Pass 2 adds a quality/security/process/dependency review, and a deterministic verifier (with recorded manual exceptions) runs Gate 5. A separate non-numbered governance gate guards Constitution amendments.

> The SRS defines *what*; the SDD defines the contract and architecture; tests enforce observable contract behaviour; adversarial verification surfaces what was missed.

## Read the methodology

- **[methodology/VSDD.md](methodology/VSDD.md)** — the full methodology.
- **[methodology/appendix-a-schemas.md](methodology/appendix-a-schemas.md)** — normative schemas & templates: CSDD security-clause schema, Constitution template, provable-property decision table, fuzzing and dependency/CVE policies, research artifact, the pass-record, finding/disposition, work-item, and manual-acceptance-evidence schemas, the SDD and TDD-compliance-log schemas, the Documented-Limitation (non-convergence) and SRS schemas, and the Intent and non-converged-release schemas (§A.1–A.16).
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

Gate 3 is *internal* to Phase 3 — after test generation, before implementation; the other gates fall at phase end. **Gate 4 grants entry to Phase 6 (formal hardening), not merge/release authority** — a *converged* release stays blocked until Gate 5 and the convergence roll-up are also committed; the only alternative is a narrow, labelled *non-converged release* of last resort (§A.16).

Convergence is declared per dimension by committed evidence: every finding — adversary or tool, at any severity — is dispositioned. A derivation-fidelity finding (Gates 1–3, Gate 4 Pass 1) is *fixed*, never signed off — a gap between a derived artifact and its source is corrected, not accepted; a quality/tool finding (Gate 4 Pass 2, Gate 5) is fixed or carries an explicit, committed Architect sign-off. Two classes can never be signed off: a CSDD MUST-security violation (fix or compliance-verify only) and an undischarged Prove-classified property (prove, re-architect, or — only when proving, re-architecting, *and* de-scoping the feature are all infeasible — ship as a labelled non-converged release of last resort, never as a pass or a convergence). A MAY-level advisory is not a finding. There is no severity cutoff that lets a defect ship unexamined or undispositioned.

## Status

The methodology is actively used and refined on real project work. A Claude Code **plugin** that enforces the gates — per-phase skills, a state-driven `PreToolUse` hook, and restricted reviewer agents — is in development and will live in this repo.

## Provenance

Every empirical citation is checked against its primary source — the [citation audit](methodology/citation-audit.md) records, for each, what the source establishes and the locator where the claim appears, verified against the source's full text. The methodology has been hardened through iterated adversarial review.

## License

[MIT](LICENSE) © 2026 Adam Daw.
