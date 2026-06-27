# Appendix A — VSDD Normative Schemas & Templates

Companion to *Verified Spec-Driven Development (VSDD)*. The main document is the methodology; this appendix holds the operational detail it points to — the full schemas, templates, and policies an *implementer* needs but a *reader* of the overview does not. Each section is referenced from the main document at the point the surface is introduced. Sections are added as the methodology's normative surfaces are specified; absence of a section means the overview's inline description is the current normative statement.

---

## A.1 — CSDD Security Clause Schema

Referenced from Phase 2 Step 2a (**Security Clauses**). A CSDD (Constitutional Spec-Driven Development) clause encodes one security constraint as a versioned, machine-readable spec element. Every clause has the following fields.

| Field | Required | Content |
|---|---|---|
| **SEC-NNN** | yes | Unique identifier. Traces through the contract chain exactly like REQ-NNN: SEC-NNN → test/proof → implementation → adversarial review. |
| **CWE reference** | yes | The weakness class the clause guards against, by MITRE CWE id (e.g. `CWE-89` SQL Injection, `CWE-79` XSS, `CWE-22` Path Traversal). One clause guards one CWE. |
| **Level** | yes | `MUST` / `SHOULD` / `MAY` — see level semantics below. |
| **Implementation pattern** | yes | The prescribed safe construction the implementation must use (e.g. "all DB access via parameterised queries / bound variables; no string-concatenated SQL"). States the *positive* pattern, not just the prohibition. |
| **Enforcement mechanism** | yes | How the clause is checked — one or more of the mechanisms enumerated below. At least one must be automated unless no automated check exists (Principle 8). |
| **Verification reference** | where applicable | The test or proof that demonstrates the clause holds, tying the clause to Gate 3 (a security test) or Gate 5 (a proof). |

### Level semantics

| Level | On violation | Gate behaviour |
|---|---|---|
| **MUST** | Rejects the implementation; requires a rewrite. | Merge-blocking. No Architect override — a MUST violation cannot be signed off, only fixed. If the constraint is genuinely inapplicable, the *clause* is amended (with rationale), not waived per-instance. |
| **SHOULD** | Generates a finding. | Proceeds only with explicit committed Architect sign-off (accept-with-rationale), consistent with the convergence rule. |
| **MAY** | Advisory. | Recorded in the clause register; non-blocking. |

### Valid enforcement mechanisms

A clause's enforcement is one or more of:

- **SAST rule** — a static-analysis rule (e.g. Semgrep, CodeQL) wired as a required CI check.
- **Dependency / secret scanner** — SCA or secret-detection gate (e.g. for `CWE-798` hard-coded credentials).
- **Type / compiler constraint** — the unsafe construction is unrepresentable or rejected at compile time.
- **Runtime assertion** — an invariant checked at execution (e.g. an authorisation guard), backed by a failure-path test.
- **Merge blocker / required CI check** — the mechanism's result is a required status that blocks merge.
- **Manual review checkbox** — permitted *only* where no automated check exists (Principle 8); requires committed evidence (reviewer + result) in the pass record.

### Worked example

```
SEC-014 — SQL Injection
  CWE:        CWE-89
  Level:      MUST
  Pattern:    All database access uses parameterised queries / bound variables.
              No string-concatenated or interpolated SQL reaches the driver.
  Enforce:    SAST rule `sql-injection` as a required CI check (merge blocker);
              where dynamic SQL is unavoidable, a manual-review checkbox with
              Architect sign-off recorded in the pass record.
  Verifies:   SEC-014-test — a malicious payload (`' OR 1=1 --`) is treated as
              data, not executed; asserts zero rows / parameter binding.
```

---

## A.2 — Constitution Template

Referenced from the pipeline prerequisite. The Constitution is the project-level governing document — established and committed *before* Phase 1, owned by the Architect, changed only by the amendment process below. It is where every per-project threshold the methodology refers to is actually set.

Required sections:

1. **Governing Principles** — the project's non-negotiable values (e.g. correctness over velocity on the critical path).
2. **Architectural Rules** — patterns all Specs must honour: layering, where I/O and persistence route, the pure-core / effectful-shell boundary, naming conventions.
3. **Quality Goals & Thresholds** — ISO 25010 goals, each with a measurable target; the coverage floor; the **severity & disposition policy** (what separates a wording nitpick from a substantive finding, per the convergence rule).
4. **Dependency Hygiene Policy** — the project's instance of justification + pinning + the review checklist (see §A.5).
5. **Security-Criticality Definition & Clause Register** — the project's operational security-critical rule and the active CSDD clauses (§A.1).
6. **Verification Budgets** — the fuzz budget (§A.4), mutation expectation, proof thresholds, and which property classes must be proven vs tested (§A.3).
7. **Amendment Process** — see below.

**Amendment process.** A Spec that would violate the Constitution triggers an amendment, never a silent exception (Principle 1). An amendment is: proposed with rationale → adversarially reviewed for *whether it weakens a guarantee* → approved by the Architect → committed as a new, dated version with the rationale retained. Amendments are themselves gated; the Constitution's version is cited by every Spec authored under it.

---

## A.3 — Provable-Property Decision Table

Referenced from Phase 2b (Verification Architecture) and Gate 2. Used to decide which properties **must be formally proven** versus where test coverage suffices — so the "should be provable" judgement at Gate 2 is rule-based, not taste.

| The property guards… | Treatment |
|---|---|
| A **security boundary** — authorisation, authentication, cryptographic correctness, trust of external input | **Prove** |
| A **financial / monetary** calculation | **Prove** |
| **Data integrity** — an irreversible mutation, a uniqueness/consistency invariant | **Prove** |
| A **safety or regulatory** guarantee | **Prove** |
| A **concurrency invariant** — no race/deadlock on shared mutable state | **Prove** where tooling allows; otherwise exhaustive property-based test + a documented limitation in the Verification Architecture |
| Everything else — UI formatting, logging, non-critical defaults | **Test only** |

**Gate-2 rule:** the Adversary rejects a property marked "testable only" if it hits any **Prove** row, and rejects a "Prove" mark whose selected tooling (§A.6) cannot actually discharge it.

---

## A.4 — Fuzzing Policy

Referenced from Phase 6 and the Gate-5 / convergence Verification criterion. A fuzz campaign against a deterministic-core target specifies:

- **Target** — the pure function, parser, or state machine under test (the effectful shell is not the fuzz target).
- **Budget** — duration or execution/coverage budget, **set in the Constitution** (e.g. "≥ N CPU-hours, or until M executions with no new coverage").
- **Corpus** — a committed seed corpus; the coverage-guided corpus is persisted across runs so coverage compounds.
- **Sanitizers** — address/UB/leak sanitizers (or the language equivalent) enabled.
- **Crash triage** — every crash is minimised to a repro, captured as a regression test, and fixed; **no crash is carried open** into convergence.
- **Exit criterion** — budget reached *and* zero un-triaged crashes *and* a coverage plateau. This is the operational meaning of the convergence row "fuzz ran to its agreed budget with no open crash."

---

## A.5 — Dependency / CVE Review Policy

Referenced from Phase 4 item 7 (Dependency Surface) and the Constitution's dependency hygiene policy. For any PR that adds or bumps a dependency, the Adversary checks:

- **Justification** — the addition traces to a spec requirement; the standard library / an existing dependency cannot serve.
- **Vulnerability scan** — an SCA tool (chosen in the Constitution — e.g. `osv-scanner`, Dependabot, Snyk) run with **timestamped output committed**.
- **Severity threshold** — set in the Constitution; default: no known **High/Critical** CVE in the resolved version.
- **Maintenance** — last release within a freshness window (Constitution-set); not archived/abandoned upstream.
- **Transitive surface** — new transitive dependencies noted; unexpected surface flagged.

**Fail conditions** (block unless the Architect signs off with a committed rationale): an unjustified addition, a severity-threshold breach, or an abandoned upstream.

---

## A.6 — Research Artifact

Referenced from Phase 2b (Verification Tooling Selection). When the verification tooling for a required proof is **uncertain**, a Research artifact (a spike) is produced *before* the Verification Architecture commits to a tool.

| Field | Content |
|---|---|
| **Question** | The uncertainty (e.g. "can Kani discharge this overflow-freedom property at our state size?"). |
| **Candidate tool(s)** | The verification stack(s) under evaluation. |
| **Representative property** | The actual property the spike attempts to prove. |
| **Result** | Whether the tool discharges it, and the constraints it imposes on code structure. |
| **Decision + rejected alternatives** | The tool selected and why others were rejected. |

**Owner:** the Builder produces it; the Architect approves. **Acceptance:** committed alongside the Constitution and Spec. The Research artifact's *conclusion* (the tooling selection and its structural constraints) lands in the Verification Architecture, which **is** reviewed at Gate 2 — so the decision is gated even though the spike's exploration, like the deliberation record, is human evidence and not itself an Adversary input.
