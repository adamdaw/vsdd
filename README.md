# VSDD — Verified Spec-Driven Development

A gated, AI-orchestrated software-engineering methodology that fuses **Spec-Driven**, **Test-Driven**, and **Verification-Driven** Development into a single pipeline: seven phases, five derivation gates, an independent adversary at each.

> Specs define *what*. Tests enforce *how*. Adversarial verification ensures *nothing was missed*.

## Read the methodology

- **[methodology/VSDD.md](methodology/VSDD.md)** — the full methodology.
- **[methodology/appendix-a-schemas.md](methodology/appendix-a-schemas.md)** — normative schemas & templates (CSDD security clauses; more as they are specified).

## The pipeline at a glance

| Phase | Gate after |
|---|---|
| 1 · Requirements Refinement → SRS | **Gate 1** · SRS Fidelity |
| 2 · Spec Crystallization → SDD | **Gate 2** · Spec Fidelity |
| 3 · Test-First Implementation | **Gate 3** · Tests vs Spec *(before code)* |
| 4 · Adversarial Refinement | **Gate 4** · Implementation vs Spec + Tests |
| 5 · Feedback Integration | — |
| 6 · Formal Hardening | **Gate 5** · Proofs vs Spec invariants *(deterministic)* |
| 7 · Convergence | — |

Convergence is declared per dimension by committed evidence: every finding — adversary or tool, at any severity — is either resolved or carries an explicit, committed Architect sign-off. There is no severity cutoff that lets a defect ship.

## Status

The methodology is stable and in active use. A Claude Code **plugin** that enforces the gates — per-phase skills, a state-driven `PreToolUse` hook, and restricted reviewer agents — is in development and will live in this repo.

## Provenance

This document was refined through VSDD's own loop: adversarially reviewed (including by an independent, different-model reviewer), with every finding dispositioned and every empirical citation verified against its primary source. See the commit history.

## License

[MIT](LICENSE) © 2026 Adam Daw.
