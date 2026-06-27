# Appendix A — VSDD Normative Schemas & Templates

Companion to *Verified Spec-Driven Development (VSDD)*. The main document is the methodology; this appendix holds the operational detail it points to — the full schemas, templates, and policies an *implementer* needs but a *reader* of the overview does not. Sections §A.1–A.10 are the current normative schema set; each is referenced from the main document at the point its surface is introduced. Further sections are added as new normative surfaces are specified.

---

## A.1 — CSDD Security Clause Schema

Referenced from Phase 2 Step 2a (**Security Clauses**). A CSDD (Constitutional Spec-Driven Development) clause encodes one security constraint as a versioned, machine-readable spec element. Every clause has the following fields.

**Two levels of clause.** The Constitution's clause register (§A.2) holds project-level **clause templates** — the standing security rules, changed only by the amendment process. A work item's SDD then carries **SEC-NNN instances** that apply a template to that feature; an instance is authored and versioned with its spec and re-enters Gate 2, *not* the amendment process. Amendment governs the template (the project-wide rule); spec review governs the instance (its application here).

| Field | Required | Content |
|---|---|---|
| **SEC-NNN** | yes | Unique identifier. Traces through the contract chain exactly like REQ-NNN: SEC-NNN → test/proof → implementation → adversarial review. |
| **CWE reference** | yes | The weakness class the clause guards against, by MITRE CWE id (e.g. `CWE-89` SQL Injection, `CWE-79` XSS, `CWE-22` Path Traversal). One clause guards one CWE. |
| **Level** | yes | `MUST` / `SHOULD` / `MAY` — see level semantics below. |
| **Implementation pattern** | yes | The prescribed safe construction the implementation must use (e.g. "all DB access via parameterised queries / bound variables; no string-concatenated SQL"). States the *positive* pattern, not just the prohibition. |
| **Enforcement mechanism** | yes | How the clause is checked — one or more of the mechanisms enumerated below. At least one must be automated unless no automated check exists (Principle 8). |
| **Verification reference** | yes | At authoring (Phase 2): the **planned** verification target — the test or proof that *will* demonstrate the clause holds. By Gate 3 (a security test) or Gate 5 (a proof): a **concrete** reference to that test or proof. Where no automated test or proof is possible, a documented reason plus committed manual-review evidence stands in. The field is never empty — a planned target is required even before the test exists. |
| **Version & status** | yes | A version tag, the date of last change, and a status of `proposed` / `active` / `superseded`. A **template** changes only through the Constitution amendment process (§A.2); a per-feature **instance** is versioned with its SDD and re-enters Gate 2. Neither changes by silent edit — this is what "versioned" means. |

### Level semantics

| Level | On violation | Gate behaviour |
|---|---|---|
| **MUST** | Rejects the implementation; requires a rewrite. | Merge-blocking. No Architect override — a MUST violation cannot be signed off; it is `fixed` or `compliance-verified` by an alternative the reviewer confirms satisfies the clause (§A.8). If the constraint is genuinely inapplicable, the *clause* is amended (with rationale), not waived per-instance. |
| **SHOULD** | Generates a finding. | Proceeds only with explicit committed Architect sign-off (accept-with-rationale), consistent with the convergence rule. |
| **MAY** | Advisory. | Recorded in the clause register as an advisory note — **not a finding**; it requires no disposition or sign-off under the convergence rule. |

### Valid enforcement mechanisms

A clause's enforcement is one or more of:

- **SAST rule** — a static-analysis rule (e.g. Semgrep, CodeQL) wired as a required CI check.
- **Dependency / secret scanner** — SCA or secret-detection gate (e.g. for `CWE-798` hard-coded credentials).
- **Type / compiler constraint** — the unsafe construction is unrepresentable or rejected at compile time.
- **Runtime assertion** — an invariant checked at execution (e.g. an authorisation guard), backed by a failure-path test.
- **Merge blocker / required CI check** — the mechanism's result is a required status that blocks merge.
- **Manual review checkbox** — permitted *only* where no automated check exists (Principle 8); requires committed evidence (reviewer + result) in the pass record, plus a recorded rationale stating why no automated check is available.

### Worked example

```
SEC-014 — SQL Injection
  CWE:        CWE-89
  Level:      MUST
  Version:    v2 · active · last changed 2026-06-10
  Pattern:    All database access uses parameterised queries / bound variables.
              No string-concatenated or interpolated SQL reaches the driver.
  Enforce:    SAST rule `sql-injection` as a required CI check (merge blocker).
              Where the SAST rule cannot prove safety (e.g. unavoidable dynamic
              SQL), a manual review must demonstrate the query is parameterised
              or built from a fixed allowlist — i.e. that it *satisfies* SEC-014
              — with that evidence committed to the pass record. A MUST clause is
              never waived by sign-off: the review verifies compliance, it does
              not grant an exception.
  Verifies:   Primary — the SAST rule confirms parameter binding and that no
              string-concatenated SQL reaches the driver (or a driver-level
              assertion that bound parameters were used). Supplemental —
              SEC-014-test feeds `' OR 1=1 --` and asserts it is treated as
              data; zero rows alone does not prove binding (it could come from
              escaping or a broken query), so the payload test never stands alone.
```

---

## A.2 — Constitution Template

Referenced from the pipeline prerequisite. The Constitution is the project-level governing document — established and committed *before* Phase 1, owned by the Architect, changed only by the amendment process below. It is where every per-project threshold the methodology refers to is actually set.

Required sections:

1. **Governing Principles** — the project's non-negotiable values (e.g. correctness over velocity on the critical path).
2. **Architectural Rules** — patterns all Specs must honour: layering, where I/O and persistence route, the pure-core / effectful-shell boundary, naming conventions.
3. **Quality Goals & Thresholds** — ISO 25010 goals, each with a measurable target; the coverage floor; the **severity & disposition policy** (what separates a wording nitpick from a substantive finding, per the convergence rule).
4. **Dependency Hygiene Policy** — the project's instance of justification + pinning + the review checklist (see §A.5).
5. **Security-Criticality Definition & Clause Register** — the project's operational security-critical rule, the active CSDD clauses (§A.1), and the **security-hardening policy**: which static-analysis and crypto-edge-case tools are required, their pass thresholds, finding disposition, and the work items they apply to.
6. **Verification Budgets** — the fuzz budget (§A.4); the **mutation expectation** (the tool, the surviving-mutant threshold, and the equivalent-mutant evidence rule per Phase 6); proof thresholds; and any *additional* property classes the project requires proven — §A.3 is the non-waivable baseline; the Constitution may tighten it or add classes, never weaken it.
7. **Amendment Process** — see below.

The Constitution references — but does not contain — the project's **ADR log** (arc42 §9): the running record of rejected alternatives and accepted trade-offs from Phase 1 deliberation and from Constitution amendments. ADRs are human evidence, never an Adversary input.

The Constitution also declares the **evidence layout**: where pass records (§A.7), finding/disposition records (§A.8), and other gate evidence are stored, and in what format — so an auditor knows where the canonical evidence lives.

**Amendment process.** A Spec that would violate the Constitution triggers an amendment, never a silent exception (Principle 1). An amendment is: proposed with rationale → adversarially reviewed for *whether it weakens a guarantee* → approved by the Architect → committed as a new, dated version with the rationale retained. An amendment that weakens a guarantee is **blocked** unless the Architect explicitly accepts the weakening with committed rationale; an amendment that would weaken a non-waivable baseline — the §A.1 MUST floor or the §A.3 Prove baseline — cannot be accepted at all. Amendment review is a **governance gate**, not one of the five derivation gates: an adversarial check of whether the amendment weakens a guarantee, recorded in its own pass record (§A.7, Gate = `Governance: Constitution amendment`). It does not change the five-gate count. The Constitution's version is cited by every Spec authored under it.

---

## A.3 — Provable-Property Decision Table

Referenced from Phase 2b (Verification Architecture) and Gate 2. Used to decide which properties **must be formally proven** versus where test coverage suffices — so the "should be provable" judgement at Gate 2 is rule-based, not taste.

| The property guards… | Treatment |
|---|---|
| A **security boundary** — authorisation, authentication, cryptographic correctness, trust of external input | **Prove** |
| A **financial / monetary** calculation | **Prove** |
| **Data integrity** — an irreversible mutation, a uniqueness/consistency invariant | **Prove** |
| A **safety or regulatory** guarantee | **Prove** |
| A **concurrency invariant** — no race/deadlock on shared mutable state | **Prove** where tooling allows; otherwise **bounded model checking** over an explicitly bounded state/schedule space (e.g. a TLA+/Spin model, or a deterministic scheduler exploring interleavings up to a stated bound) plus a documented limitation naming that bound in the Verification Architecture. An unbounded "exhaustive" claim is not acceptable — the bound is stated and justified. |
| Everything else — UI formatting, logging, non-critical defaults | **Test only** |

**Gate-2 rule:** the Adversary rejects a property marked "testable only" if it hits any **Prove** row, and rejects a "Prove" mark whose selected tooling — the Phase 2b Verification Tooling Selection, validated by a §A.6 Research artifact where the choice was uncertain — cannot actually discharge it.

This table is the **non-waivable baseline**: a project's Constitution may tighten it — moving a Test-only property to Prove, or adding classes — but may never downgrade a Prove row to test-only.

**When proof tooling cannot discharge a Prove property** (beyond the concurrency row's bounded fallback): this is an architectural escalation (Phase 5), never a quiet downgrade to test-only. An undischarged Prove property leaves the **Verification dimension unconverged** — there is no signed-off exception that counts as passing. The Architect either (a) re-architects so the property becomes provable, or (b) consciously ships a **documented limitation** — which explicitly does *not* satisfy convergence for that property (Principle 10 is unmet, and the Zero-Slop claim is withheld for it), recorded as an honest non-convergence, not a waiver. A property also governed by a CSDD security clause retains its §A.1 MUST floor regardless.

---

## A.4 — Fuzzing Policy

Referenced from Phase 6 and the Gate-5 / convergence Verification criterion. A fuzz campaign against a deterministic-core target specifies:

- **Target** — the pure function, parser, or state machine under test (the effectful shell is not the fuzz target).
- **Budget** — **set in the Constitution** as two stop conditions that are both required: a **minimum effort** (≥ N CPU-hours or ≥ M executions) and a **coverage plateau** (no new coverage edge for a stated span — e.g. no new edge in the last K executions or T minutes). The campaign runs until *both* the minimum effort is met *and* the plateau is reached; the plateau is part of the budget definition, not a separate condition that could conflict with it. A Constitution-set **maximum** wall-clock cap bounds the campaign so it always terminates: if the plateau is not reached by the cap, the campaign stops and the Architect records an escalation / non-convergence rather than running indefinitely.
- **Corpus** — a committed seed corpus; the coverage-guided corpus is persisted across runs so coverage compounds.
- **Sanitizers** — address/UB/leak sanitizers (or the language equivalent) enabled.
- **Crash triage** — every crash is minimised to a repro, captured as a regression test, and fixed; **no crash is carried open** into convergence.
- **Exit criterion** — the budget's minimum-effort and coverage-plateau conditions are both satisfied *and* zero un-triaged crashes remain. This is the operational meaning of the convergence row "fuzz ran to its agreed budget with no open crash."

---

## A.5 — Dependency / CVE Review Policy

Referenced from Phase 4 item 7 (Dependency Surface) and the Constitution's dependency hygiene policy. For any PR that adds or bumps a dependency, the Adversary checks:

- **Justification** — the addition traces to a spec requirement; the standard library / an existing dependency cannot serve.
- **Vulnerability scan** — an SCA tool (chosen in the Constitution — e.g. `osv-scanner`, Dependabot, Snyk) run with **timestamped output committed** (a redacted summary plus a retained CI-artifact link is permitted where the full output would leak private dependency metadata in a public repo).
- **Severity threshold** — set in the Constitution; default: no known **High/Critical** CVE in the resolved version. **Every known CVE is dispositioned regardless of severity**: a Low/Medium CVE is not auto-passed — it is fixed, or carried with a committed Architect accept-the-risk rationale. Severity decides what *blocks* merge (High/Critical by default) versus what merely *requires a recorded disposition*; it never lets a known CVE pass unexamined.
- **Maintenance** — last release within a freshness window (Constitution-set), *or* a maintained-but-stable exception: a mature package with no recent release is acceptable where ongoing activity (issue triage, security response) is evidenced. Not archived/abandoned upstream.
- **Transitive surface** — new transitive dependencies noted; unexpected surface flagged.
- **Scan freshness** — the SCA scan has a Constitution-set TTL; if the committed scan is older than that window at merge or release, a re-scan is mandatory before proceeding. A stale scan is not evidence.

**Fail conditions** (block unless the Architect signs off with a committed rationale): an unjustified addition, a severity-threshold breach, or an abandoned upstream.

---

## A.6 — Research Artifact

Referenced from Phase 2b (Verification Tooling Selection). When the verification tooling for a required proof is **uncertain**, a Research artifact (a spike) is produced *before* the Verification Architecture commits to a tool. Uncertainty is not the Builder's discretion — it is triggered objectively when *any* of these holds: the first use of a given verifier in the repo; an unsupported language/property pair (no precedent that this tool discharges this property class); an unproven scale bound (the property must hold at a size the tool has not been shown to reach here); or no prior passing representative proof on record. If any trigger fires, the Research artifact is mandatory.

| Field | Content |
|---|---|
| **RESEARCH-NNN** | Unique identifier; cited by the Verification Architecture and the §A.7 record that consume it. |
| **Question** | The uncertainty (e.g. "can Kani discharge this overflow-freedom property at our state size?"). |
| **Candidate tool(s)** | The verification stack(s) under evaluation. |
| **Representative property** | The actual property the spike attempts to prove. |
| **Result** | Whether the tool discharges it, and the constraints it imposes on code structure. |
| **Acceptance criterion** | What result counts as discharging the question (e.g. "the tool proves the representative property within the stated scale bound"). |
| **Evidence** | The command(s) run and their output, or committed links, demonstrating the result. |
| **Decision + rejected alternatives** | The tool selected and why others were rejected. |
| **Approval** | The Architect approval (who, when) — required before the conclusion is consumed. |
| **Consumed-by** | The Verification Architecture (and its Gate 2 record) that consumes the conclusion. |

**Owner:** the Builder produces it; the Architect approves — the approval (who, when) is recorded with the artifact. **Location:** committed to a dedicated, versioned research path (e.g. `docs/research/<property-slug>.md`) and referenced from the Verification Architecture that consumes its conclusion. The Research artifact's *conclusion* (the tooling selection and its structural constraints) lands in the Verification Architecture, which **is** reviewed at Gate 2 — so the decision is gated even though the spike's exploration *narrative*, like the deliberation record, is human evidence and not an Adversary input. The research **result** — whether the selected tool can discharge the property — is objective evidence available to the Gate 2 Adversary; only the exploration narrative is withheld.

---

## A.7 — Pass-Record Schema

Referenced from every gate (Gates 1–5), Phase 7 (Convergence), and Core Principles 8 and 11. A **pass record** is the committed evidence that a gate was cleared — the artifact a fresh session, an auditor, or the convergence roll-up reads to confirm a gate held. A gate without a committed pass record has not been passed, regardless of any actor's recollection (Principle 11). Storage location and file format are set by the project; the required fields are below.

**What PASS means (canonical).** A gate's **PASS** means every finding it produced is *dispositioned* — fixed, or carrying a committed Architect sign-off (accept-with-rationale, or accept-risk deferral) — **not** that zero findings were raised. The verdict flips from FAIL to one of `PASS_CLEAN` / `PASS_FIXED` / `PASS_ACCEPTED` (see the Verdict field) once the findings are dispositioned, cited in *Resolved findings reviewed*. Two finding classes cannot be signed off: a CSDD MUST-security finding (fixed or compliance-verified only, §A.1) and an undischarged Prove-classified property (proven or re-architected, §A.3). Wherever the methodology says a gate "clears," "is clean," or "passes," it means this.

**Which gates may accept.** Derivation-fidelity gates — Gate 1, Gate 2, Gate 3, and Gate 4 Pass 1 — may close only `PASS_CLEAN` or `PASS_FIXED`: a fidelity gap between a derived artifact and its source is fixed, never signed off. Only Gate 4 Pass 2 (quality / security / process / dependency) and tool findings (analyzer, CVE) may close `PASS_ACCEPTED`.

| Field | Required | Content |
|---|---|---|
| **Gate** | yes | Which gate this records (Gate 1–5), **Convergence (roll-up)** for the Phase 7 exit record, or **Governance: Constitution amendment** (a non-numbered governance gate, §A.2); plus the phase/step it sits at. |
| **Artifact(s) reviewed** | yes | The source and derived artifacts under review, each pinned to a commit SHA or content hash — so the record names *exactly* what was reviewed, not "the spec" in the abstract. |
| **Reviewer** | yes | For Gates 1–4: the Adversary's identity (human name, or AI model + confirmation of context reset) and explicit disclosure of any prior involvement (Phase 4 independence) — `none` is a valid, required value. **For Gate 5 (deterministic verification): the tool identity instead** — name, version, configuration, the seed/corpus/input hash, and the exact command — since the "reviewer" is a verifier with no goodwill to disclose. Gate 5's manual-judgment parts (equivalent-mutant justification, purity-boundary audit conclusions) additionally name the human reviewer, the Architect sign-off, and the committed evidence (the §A.1 manual-exception rule). |
| **Objective evidence** | yes | The commands run and their output — test-runner result, SAST/SCA output, CI status, proof/mutation/fuzz results — or links to those committed outputs. The evidence the verdict rests on (Principle 11). |
| **Resolved findings reviewed** | where prior FAIL records exist | The FIND-NNN dispositions (§A.8) this PASS relies on — the findings fixed or signed off since the last FAIL on this gate. Links the clean pass to the dispositions that earned it; empty only on a first-pass clean gate. |
| **Enforcement matrix** | yes | Per gate criterion: the automated check that enforces it, or a committed rationale for why it must stay manual (Principle 8). The absence of one or the other is itself a gate failure. |
| **Architect approval** | yes | The Architect's sign-off on the gate decision (who, when) — the final authority's acceptance of the verdict and of any dispositions relied on. Required on every gate record and on the convergence roll-up. |
| **Verdict** | yes | One of: **`PASS_CLEAN`** — zero valid findings; *only* this verdict carries the literal *"Forced to manufacture flaws. Artifact(s) meet standard."* declaration. **`PASS_FIXED`** — every finding was fixed, none accepted. **`PASS_ACCEPTED`** — some findings carry a committed sign-off or deferral; the verdict lists the accepted risks (a "meet standard" declaration would be false, so it is not used). **`FAIL`** — open findings remain. *Gate 5:* each tool subrecord and manual-exception subrecord carries its own pass / fail; the *final* Gate 5 verdict uses the canonical enum (`PASS_CLEAN` when every subrecord is clean, else `PASS_FIXED` / `PASS_ACCEPTED` / `FAIL` per the dispositions), not an adversarial declaration. *Convergence roll-up:* the assertion that all five gate records are committed and no finding is open. |
| **Findings** | where applicable | The FIND-NNN ids (§A.8) *newly* raised in this review. Empty on a clean pass. |
| **Timestamp** | yes | When the review was performed — evidence is fresh, not recalled. |

A **convergence record** is a roll-up variant: its Gate field is `Convergence (roll-up)`, its *Artifact(s) reviewed* lists the five gate pass records it cites, and its *Resolved findings reviewed* enumerates every disposition. It asserts that all five gate records are committed and no finding is left open — a deterministic check, carrying no adversarial verdict of its own beyond that assertion.

A **Gate 4 record** is composite: a Pass 1 subrecord and a Pass 2 subrecord, each with its own reviewer and independence disclosure, linked by a final Gate 4 verdict that is PASS only when both subpasses pass. Pass 1 may close only `PASS_CLEAN` / `PASS_FIXED`; Pass 2 may also be `PASS_ACCEPTED`.

A **Gate 5 record** is composite: one tool-result subrecord per deterministic check (proof, fuzz, mutation), each carrying the tool-identity fields above, plus one manual-exception subrecord per human judgment (equivalent-mutant justification, purity-boundary audit conclusion), each carrying its reviewer, Architect sign-off, and committed evidence. The final Gate 5 verdict is PASS only when every subrecord passes.

### Worked example

```
PASS-RECORD
  Gate:       Gate 3 (Tests vs Spec) — Phase 3, before implementation
  Artifacts:  spec/order-pricing.md @ a1b2c3d
              tests/order_pricing_test.py @ a1b2c3d
  Reviewer:   AI Adversary (claude, fresh context) — prior involvement: none
  Evidence:   new work-item tests: `pytest tests/order_pricing_test.py`
                → 14 failed, 0 passed (Red Gate holds for new tests)
              pre-existing suite: `pytest --ignore=tests/order_pricing_test.py`
                → 212 passed, 0 failed (baseline stayed green)
              2 stubs carry committed no-red justifications (Principle 3)
  Enforcement: Red Gate — automated (pre-impl hook); test↔spec mapping —
               manual (Adversary), rationale: semantic judgment, no script
  Verdict:    PASS_CLEAN — "Forced to manufacture flaws. Artifact(s) meet standard."
  Architect:  A. Daw approved, 2026-06-27T14:05Z
  Findings:   none
  Timestamp:  2026-06-27T14:02Z
```

---

## A.8 — Finding / Disposition Record

Referenced from §II (Adversary), Phase 4, Phase 5, Core Principle 9, and the Phase 7 convergence rule. Every finding raised by an Adversary or by tooling (static analysis, fuzzer, mutation tester) gets one record; convergence is "every finding dispositioned," and this is the unit that carries the disposition. The record is what makes "no severity auto-pass" auditable: an open finding with no committed disposition blocks the gate. `fixed`, `compliance-verified`, `signed-off`, and `deferred` are all *closed* dispositions — only `open` blocks. "None left open" (Phase 7) therefore permits `deferred` and `signed-off` defects; the convergence roll-up (§A.7) lists every such accepted risk explicitly, so nothing unfixed is hidden.

**Admissibility at a later gate.** When a prior pass's finding/disposition records are admitted as evidence to a fresh Adversary (§II), the *objective* fields are admissible — FIND-NNN, Class, Source, Location, Severity, Status, and the fix Evidence; the **Disposition rationale** (the Architect's reasoning behind a sign-off) is withheld commentary, like the deliberation record. The Adversary sees *that* a finding was dispositioned and how, not the reasoning narrative behind it.

| Field | Required | Content |
|---|---|---|
| **FIND-NNN** | yes | Unique identifier, cited by the pass record (§A.7) and any linked work item. |
| **Source** | yes | What raised it — the Adversary (which gate) or a tool (which analyzer / fuzzer / mutation run). |
| **Location** | yes | Artifact + position, in the Adversary's `[Location — Topic]` form. |
| **Description** | yes | The concrete flaw. |
| **Severity** | yes | One of the required baseline enum — `blocker` (ships a defect or blocks a gate) / `major` (a substantive defect that should not ship un-dispositioned) / `minor` (cosmetic or wording) — set per the Constitution's severity policy. A project may add finer levels only as documented aliases that preserve this baseline mapping. Orders the work and informs the decision; never auto-passes (Phase 7). |
| **Class** | yes | `standard`, `CSDD-MUST` (a MUST-level security clause violation, §A.1), or `Prove-property` (an undischarged Prove-classified property, §A.3). The class sets which statuses are permitted. |
| **Status** | yes | `open` · `fixed` · `signed-off` (accept-with-rationale) · `deferred` (tracked follow-up with accept-the-risk) · `compliance-verified` (a *closed* status for `CSDD-MUST` only: a reviewer confirmed an alternative construction satisfies the clause, with committed evidence — not a code fix). Constraints by class: a `standard` finding may take any of `open`/`fixed`/`signed-off`/`deferred`; a `CSDD-MUST` finding may be only `open`, `fixed`, or `compliance-verified` — never `signed-off`/`deferred`; a `Prove-property` finding may be only `open` or `fixed` (proven or re-architected), and if shipped it is recorded as explicit non-convergence outside a passing gate, never as a disposition. |
| **Disposition rationale** | where status ≠ `fixed` | The Architect's reasoning for the sign-off or deferral. |
| **Architect sign-off** | where status ∈ {`signed-off`, `deferred`} | Who signed and when — the committed sign-off the convergence rule requires. |
| **Linked item** | where status = `deferred` | The tracked follow-up work item (ITEM-NNN, §A.9) carrying the deferred fix. A deferral with no linked item is not a disposition. |
| **Evidence** | yes | The fix commit (for `fixed`) or the committed rationale (for `signed-off` / `deferred`). |

### Worked example

```
FIND-031
  Source:        Adversary — Gate 4 (Pass 2, Code Quality)
  Class:         standard
  Location:      [services/pricing.py:88 — error handling]
  Description:   Bare `except:` swallows the currency-conversion failure path;
                 no test covers the failed-conversion branch.
  Severity:      major
  Status:        fixed
  Evidence:      fix commit e4f5a6b — narrowed to `except ConversionError`,
                 added pricing_test.py::test_conversion_failure
```

---

## A.9 — Work-Item Schema

Referenced from §II (the Tracker), the Phase 1 decomposition bridge, and Phase 2 (Tracker Integration). A **work item** is the Tracker's atomic unit — the thing the issue-assignment hook (Principle 8) requires before any code edit, and the active-item pointer a fresh session reads to orient. The Tracker holds the work-item state; the repo holds the artifact content it points to (§VI).

| Field | Required | Content |
|---|---|---|
| **ITEM-NNN** | yes | Unique identifier; the active-item pointer the Tracker exposes to a context-reset session. |
| **Single responsibility** | yes | A one-line statement of the item's single responsibility. An item that cannot name one — or cannot deploy without a sibling — is not atomic and must be split before Phase 2 (decomposition bridge). |
| **Requirement links** | yes | The REQ-NNN(s) (and SEC-NNN where security-critical) this item implements. Every item traces to a requirement — the Tracker cannot invent requirements (§II). |
| **Owner / assignee** | yes | The actor (human or AI) responsible. Assignment is required *before* any code edit — enforced by the hook, not requested by a prompt (§II, Principle 8). |
| **Criticality** | yes | The security-critical boolean tag (Phase 2 Step 2a), **Architect-approved** — with the approver, timestamp, and a one-line rationale recorded, since the tag drives mandatory CSDD and proof obligations. |
| **Dependencies** | where applicable | Edges to the ITEM-NNN that must complete first — the dependency graph that governs parallelism (§VI). Empty means independently deployable. |
| **Status** | yes | A baseline status enum: `proposed` · `active` (assigned, in progress) · `blocked` (waiting on a dependency) · `review` (at a gate) · `done` (converged) · `deferred` · `cancelled`. `active` is the session-survivable state a fresh session reads without re-reading conversation history. Projects may add states only as aliases mapping onto this baseline. |
| **Artifact pointers** | where applicable | Links to the item's light-SRS slice, spec contract, tests, and TDD log in the repo. The Tracker holds the pointer; the repo holds the content. |

### Worked example

```
ITEM-204
  Responsibility:  Apply tiered loyalty discount to an order subtotal.
  Requirements:    REQ-077, REQ-078; SEC-009 (PII in loyalty lookup)
  Owner:           claude (Builder) — assigned
  Criticality:     security-critical = true
  Dependencies:    ITEM-201 (order-subtotal calculation)
  Status:          active
  Artifacts:       spec/loyalty-discount.md, tests/loyalty_discount_test.py,
                   .vsdd/tdd-logs/ITEM-204.md
```

---

## A.10 — Manual-Acceptance Evidence Record

Referenced from Phase 1 (confirmation modes) and Gate 3. A Gherkin scenario whose confirmation mode is `environment-visible` or `person-confirmed` cannot map to an executable test; it maps instead to a **manual-acceptance evidence record**. The record is what lets Gate 3 confirm such a scenario is covered without an automated test, and what convergence reads to confirm it was actually checked, not merely planned.

| Field | Required | Content |
|---|---|---|
| **Scenario** | yes | The REQ-NNN and the Gherkin scenario this record covers. |
| **Confirmation mode** | yes | `environment-visible` or `person-confirmed` (§ Phase 1 enum). |
| **Status** | yes | `planned` (authored at Gate 3, before code) or `executed` (performed against the built system). A scenario is covered at Gate 3 with `planned`; convergence requires `executed`. |
| **Owner** | yes | Who is responsible for the scenario; on a `planned` record this is the person who will execute it (no check has been performed yet). |
| **Environment** | where applicable | The build / environment the check ran against, pinned to a commit or release where possible. |
| **Steps** | yes | The concrete steps taken — reproducible by another person. |
| **Result** | yes on `executed` | Observed outcome against the scenario's expected `Then`. |
| **Executed reviewer + sign-off** | yes on `executed` | Who actually performed the check, plus the Architect or delegated sign-off, with timestamp — required only once the record is `executed`. |

### Worked example

```
MANUAL-ACCEPTANCE
  Scenario:    REQ-051 — "Given a printed invoice, Then the totals column
               aligns right and the footer shows the page count"
  Mode:        environment-visible
  Status:      executed
  Owner:       A. Daw
  Environment: staging @ release-2026.06.3
  Steps:       1. Generate invoice PDF for order #4471
               2. Open in viewer; inspect totals column + footer
  Result:      Totals right-aligned; footer "Page 1 of 2" — matches Then
  Executed reviewer + sign-off:  A. Daw, 2026-06-27T16:10Z
```
