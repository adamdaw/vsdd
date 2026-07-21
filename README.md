# VSDD — Verified Spec-Driven Development

A gated software-engineering methodology — AI-orchestrated by default, but actor-agnostic in its execution roles — that fuses **Spec-Driven**, **Test-Driven**, and **Verification-Driven** Development into a single pipeline: seven phases and **five numbered gates** — an independent adversary runs the derivation-fidelity checks (Gates 1–3 and Gate 4 Pass 1), Gate 4 Pass 2 adds a quality/security/process/dependency review, and a deterministic verifier (with recorded manual exceptions) runs Gate 5. A separate non-numbered governance gate guards Constitution amendments.

> The SRS defines *what*; the SDD defines the contract and architecture; tests enforce observable contract behaviour; adversarial verification surfaces what was missed.

## Read the methodology

- **[methodology/VSDD.md](methodology/VSDD.md)** — the full methodology.
- **[methodology/appendix-a-schemas.md](methodology/appendix-a-schemas.md)** — normative schemas & templates: CSDD security-clause schema, Constitution template, provable-property decision table, fuzzing and dependency/CVE policies, research artifact, the pass-record, finding/disposition, work-item, and manual-acceptance-evidence schemas, the SDD and TDD-compliance-log schemas, the Documented-Limitation (non-convergence) and SRS schemas, the Intent and non-converged-release schemas, the reviewer-bundle / evidence-layout schema, the ADR schema, and the Gate 1 elicitation-facts schema (§A.1–A.19).
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

Convergence is declared per dimension by committed evidence: every finding — adversary or tool, at any severity — is dispositioned. A derivation-fidelity finding (Gates 1–3, Gate 4 Pass 1) is *fixed*, never signed off — a gap between a derived artifact and its source is corrected, not accepted; a quality/tool finding (Gate 4 Pass 2, Gate 5) is fixed or carries an explicit, committed Architect sign-off. Sign-off accepts a *risk*; several categories can never be signed off because they are *defects* or *non-convergence*, not risks. Two are non-waivable baselines: a CSDD MUST-security violation (fix or compliance-verify only) and an undischarged Prove-classified property (prove, re-architect to provable, de-scope the feature via a reviewed SRS/SDD change as applicable, or — only when all three are infeasible — authorize a labelled non-converged release of last resort, never as a pass or a convergence). That release path is eligible **only** for a property that passed Gate 2 as provable but failed to discharge at Gate 5 execution; a property known-unprovable at Gate 2 is fixed there, never released. Demonstrated Gate 5 defects — fuzz crashes, non-equivalent mutation survivors, and purity-boundary violations — are also fixed, not signed off (a verified-equivalent mutant closes as resolved). Genuinely waivable risks — SHOULD-level clauses, analyzer findings, dependency CVEs — may carry a committed sign-off. A MAY-level advisory is not a finding. There is no severity cutoff that lets a defect ship unexamined or undispositioned.

## The plugin

A Claude Code **plugin** that enforces the gates lives in **[plugin/](plugin/)**, built against the methodology as its spec:

- a state-driven `PreToolUse` hard-gate hook (`plugin/hooks/gate-check.js`) that blocks implementation source until Gate 3 clears — markdown, tests, and `.vsdd/` are never blocked, and the hook is silent outside a VSDD project;
- `.vsdd/state.json` as the per-project state machine, with `/vsdd-init` and `/vsdd-advance` commands (advance refuses to clear a gate whose required artifacts are absent);
- restricted adversarial reviewer agents (`vsdd-test-validator` at Gate 3, `vsdd-spec-reviewer` and `vsdd-code-reviewer` for Gate 4 Pass 1/Pass 2);
- an orchestrator skill plus one per-phase skill for each of the seven phases.

This repo doubles as a plugin marketplace. To install:

```
/plugin marketplace add adamdaw/vsdd
/plugin install vsdd@vsdd
```

Then `/vsdd-init` in a project to begin Phase 1 under enforcement.

## Status

The methodology is stable (converged through independent adversarial review) and under active refinement. The plugin is at `0.1.0`.

## Provenance

Every empirical citation is checked against its primary source — the [citation audit](methodology/citation-audit.md) records, for each, what the source establishes and the locator where the claim appears, verified against the source's full text.

## License

[MIT](LICENSE) © 2026 Adam Daw.
