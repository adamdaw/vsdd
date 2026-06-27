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
