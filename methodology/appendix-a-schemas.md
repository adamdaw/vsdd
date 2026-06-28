# Appendix A — VSDD Normative Schemas & Templates

Companion to *Verified Spec-Driven Development (VSDD)*. The main document is the methodology; this appendix holds the operational detail it points to — the full schemas, templates, and policies an *implementer* needs but a *reader* of the overview does not. Sections §A.1–A.16 are the current normative schema set; each is referenced from the main document at the point its surface is introduced. Further sections are added as new normative surfaces are specified.

---

## A.1 — CSDD Security Clause Schema

Referenced from Phase 2 Step 2a (**Security Clauses**). A CSDD (Constitutional Spec-Driven Development) clause encodes one security constraint as a versioned, machine-readable spec element. Every clause has the following fields.

**Two levels of clause.** The Constitution's clause register (§A.2) holds project-level **clause templates**, each identified `SECT-NNN` (Security Clause Template) — the standing security rules, changed only by the amendment process. A work item's SDD then carries **`SEC-NNN` instances** that apply a `SECT-NNN` template to that feature; each instance names the template it instantiates. An instance is authored and versioned with its spec and re-enters Gate 2, *not* the amendment process. Amendment governs the template (the project-wide rule); spec review governs the instance (its application here). The two namespaces are distinct: `SECT-NNN` is template-only, `SEC-NNN` is instance-only.

| Field | Required | Content |
|---|---|---|
| **SEC-NNN** | yes | Unique **instance** identifier (instance-only; the project-level rule it applies is a `SECT-NNN` template, §A.2 register). Traces through the contract chain exactly like REQ-NNN: SEC-NNN → enforcement artifact → implementation → adversarial review. |
| **Template reference** | yes | The `SECT-NNN` clause template (Constitution register, §A.2) this instance applies. Every `SEC-NNN` instance names its template. |
| **CWE reference** | yes | The weakness class the clause guards against, by MITRE CWE id (e.g. `CWE-89` SQL Injection, `CWE-79` XSS, `CWE-22` Path Traversal). One clause guards one CWE. |
| **Level** | yes | `MUST` / `SHOULD` / `MAY` — see level semantics below. |
| **Implementation pattern** | yes | The prescribed safe construction the implementation must use (e.g. "all DB access via parameterised queries / bound variables; no string-concatenated SQL"). States the *positive* pattern, not just the prohibition. |
| **Enforcement mechanism** | yes | How the clause is checked — one or more of the mechanisms enumerated below. At least one must be automated unless no automated check exists (Principle 8). |
| **Verification reference** | yes | At authoring (Phase 2): the **planned enforcement artifact** — the test, proof, SAST rule, dependency/secret scanner gate, compiler constraint, runtime-assertion test, or merge-blocker that *will* demonstrate the clause holds — named with its **owning gate** (e.g. a security test at Gate 3, a SAST rule or scanner at Gate 4 Pass 2, a proof or crypto-suite at Gate 5). By that gate: a **concrete** reference to the enforcement artifact in place. Where no automated enforcement is possible, a documented reason plus committed manual-review evidence stands in. The field is never empty — a planned artifact with its owning gate is required even before it exists. |
| **Version & status** | yes | A version tag, the date of last change, and a status of `proposed` / `active` / `superseded`. A **template** changes only through the Constitution amendment process (§A.2); a per-feature **instance** is versioned with its SDD and re-enters Gate 2. Neither changes by silent edit — this is what "versioned" means. |

### Level semantics

| Level | On violation | Gate behaviour |
|---|---|---|
| **MUST** | Rejects the implementation; requires a rewrite. | Merge-blocking. No Architect override — a MUST violation cannot be signed off; it is `fixed` or `compliance-verified` by an alternative the reviewer confirms satisfies the clause (§A.8). If the constraint is genuinely inapplicable to a work item, that is an **instance-level** decision at Gate 2 (the `SEC-NNN` instance is not authored for that item, with the `none: no CWE-backed surface` rationale of §A.11); if the constraint is inapplicable **project-wide**, the **`SECT-NNN` template** is amended through the Constitution amendment process (§A.2), not waived per-instance. |
| **SHOULD** | Generates a finding. | Proceeds only when the finding is *fixed* (the safe pattern implemented) or carries an explicit committed Architect sign-off (accept-with-rationale) — consistent with the convergence rule. |
| **MAY** | Advisory. | **Not a finding**; requires no disposition or sign-off under the convergence rule. A **template-level** MAY (`SECT-NNN`) is recorded in the Constitution's clause register; a **per-instance** MAY advisory (`SEC-NNN`) is recorded in the SDD and its Gate 2 pass evidence, *not* in the Constitution template register. |

### Inapplicability vs weakening (amending a MUST clause)

A MUST clause is amended out or scoped down only on a showing of **inapplicability**, never of inconvenience. The two are separated by one test: *does the guarded weakness class have any reachable surface in the project?*

- **Inapplicable (amendment permitted).** The CWE the clause guards cannot occur — the attack surface does not exist in this system (e.g. a `CWE-89` SQL-injection clause in a project with no database or query layer). The amendment carries **committed evidence that the weakness class has no reachable surface** (the architectural fact that closes the vector), reviewed at the §A.2 governance gate. Removing protection for a vector that cannot fire does not weaken the baseline.
- **Weakening (blocked).** The guarded weakness class *does* have reachable surface, but the clause is relaxed anyway — MUST→SHOULD, the safe pattern loosened, or the enforcement removed — leaving a real surface under-protected. This is a forbidden weakening of the §A.1 MUST floor (§A.2) and cannot be accepted, by the Architect or anyone.

The burden is on the amendment to prove non-reachability; absent that proof, scoping a MUST clause down is treated as weakening, not inapplicability. The governance-gate Adversary reviews the reachability evidence specifically (§A.2).

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
  Template:   SECT-003 (SQL injection — parameterised-query rule, Constitution register)
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

**Required metadata (header).** Every Constitution carries an **identifier**, a **version**, the **date** of that version, a **status** (`active` / `superseded`), and a **supersedes** link to the prior version (`none` for the first active Constitution, which has no predecessor). The version is the value every Spec, SDD (§A.11), and pass record (§A.7) cites; without it, "the Constitution version" is unpinnable and prospective-only weakening (the amendment rule) cannot be enforced.

Required sections:

1. **Governing Principles** — the project's non-negotiable values (e.g. correctness over velocity on the critical path).
2. **Architectural Rules** — patterns all Specs must honour: layering, where I/O and persistence route, the pure-core / effectful-shell boundary, naming conventions.
3. **Quality Goals & Thresholds** — ISO 25010 goals, each with a measurable target; the **coverage floor**, specified completely enough to be objectively checkable (Principle 8) — the metric (line / branch / statement), the tool and config, the included paths and exclusions, the threshold, the rounding rule, and the evidence command that produces the number; a bare percentage is not a checkable floor; the **severity & disposition policy** (what separates a wording nitpick from a substantive finding, per the convergence rule).
4. **Dependency Hygiene Policy** — the project's instance of justification + pinning + the review checklist (see §A.5).
5. **Security-Criticality Definition & Clause Register** — the project's operational security-critical rule, the active CSDD clause **templates** (`SECT-NNN`, §A.1), and the **security-hardening policy**: which static-analysis and crypto-edge-case tools are required, their pass thresholds, finding disposition, and the work items they apply to. Includes a required **analyzer-ownership matrix** assigning each required analyzer to *exactly one* gate — Gate 4 (diff-scoped code-quality and security analysis) or Gate 5 (deeper whole-program and crypto-edge-case suites) — so that no analyzer is run twice and none is unowned (Phase 6, "each required analyzer is owned by exactly one gate").
6. **Verification Budgets** — the fuzz budget (§A.4); the **mutation expectation** (the tool; the **mutation-score threshold, computed *after* excluding justified equivalent mutants** — this is not a licence to leave non-equivalent survivors: every non-equivalent survivor remains blocking and must be killed or justified as equivalent, per Phase 6; and the equivalent-mutant evidence rule); proof thresholds; and any *additional* property classes the project requires proven — §A.3 is the non-waivable baseline; the Constitution may tighten it or add classes, never weaken it.
7. **Amendment Process** — see below.

The Constitution references — but does not contain — the project's **ADR log** (arc42 §9): the running record of rejected alternatives and accepted trade-offs from Phase 1 deliberation and from Constitution amendments. ADRs are human evidence, never an Adversary input.

The Constitution also declares the **evidence layout**: where pass records (§A.7), finding/disposition records (§A.8), and other gate evidence are stored, and in what format — so an auditor knows where the canonical evidence lives.

**Amendment process.** A Spec that would violate the Constitution triggers an amendment, never a silent exception (Principle 1). An amendment is: proposed with rationale → adversarially reviewed for *whether it weakens a guarantee* → approved by the Architect → committed as a new, dated version with the rationale retained. An amendment that weakens a guarantee is **blocked** unless the Architect explicitly accepts the weakening with committed rationale; an amendment that would weaken a non-waivable baseline — the §A.1 MUST floor or the §A.3 Prove baseline — cannot be accepted at all. Amending out or scoping down a MUST clause is permitted *only* on the inapplicability showing of §A.1 — committed evidence that the guarded weakness class has no reachable surface — which the governance-gate Adversary reviews specifically; a relaxation that leaves a reachable surface under-protected is a forbidden weakening, not an inapplicability amendment.

**Waivable vs non-waivable.** The non-waivable baselines — the §A.1 MUST floor and the §A.3 Prove baseline — can never be weakened, by the Architect or anyone. Every *other* guarantee (a quality-goal threshold, the coverage floor, a CVE-severity or freshness window, the fuzz budget) is **waivable**: the Architect may accept a weakening, but only via a distinct **accepted-risk amendment record** — the proposed new value, the guarantee given up, the risk accepted, and the Architect's committed sign-off — reviewed at the governance gate for whether it crosses into a non-waivable baseline (if it does, it is blocked). An accepted weakening takes effect **prospectively only**: it sets the baseline for work authored under the new Constitution version and does *not* retroactively re-converge or re-open already-passed gate records, each of which stays pinned to the Constitution version it cited (§A.7). Amendment review is a **governance gate**, not one of the five numbered gates: an adversarial check of whether the amendment weakens a guarantee, recorded in its own pass record (§A.7, Gate = `Governance: Constitution amendment`). It does not change the five-gate count. The Constitution's version is cited by every Spec authored under it.

---

## A.3 — Provable-Property Decision Table

Referenced from Phase 2b (Verification Architecture) and Gate 2. Used to decide which properties **must be formally proven** versus where test coverage suffices — so the "should be provable" judgement at Gate 2 is rule-based, not taste.

| The property guards… | Treatment |
|---|---|
| A **security boundary** — authorisation, authentication, cryptographic correctness, trust of external input | **Prove** |
| A **financial / monetary** calculation | **Prove** |
| **Data integrity** — an irreversible mutation, a uniqueness/consistency invariant | **Prove** |
| A **safety or regulatory** guarantee | **Prove** |
| A **concurrency invariant** — no race/deadlock on shared mutable state | **Prove** where tooling allows; otherwise **bounded model checking** over an explicitly bounded state/schedule space (e.g. a TLA+/Spin model, or a deterministic scheduler exploring interleavings up to a stated bound) plus a **bound statement** naming that bound in the Verification Architecture (a bound statement is ordinary, converged documentation — distinct from a normative `Documented-Limitation` record, §A.13, which is reserved for the under-envelope, non-converged case below). An unbounded "exhaustive" claim is not acceptable — the bound is stated and justified **against the claimed operating envelope** (the maximum thread/process count, queue depth, and state size the property must hold over in production). **Gate-2 rule:** the Adversary rejects a bound that does not cover that operating envelope, or is trivially small relative to it; a bound smaller than the envelope ships only as an explicit **Documented-Limitation non-convergence record (§A.13)** — which leaves the Verification dimension unconverged, not an accepted risk that passes — never as a silent default. |
| Everything else — UI formatting, logging, non-critical defaults | **Test only** |

**Gate-2 rule:** the Adversary rejects a property marked "testable only" if it hits any **Prove** row, and rejects a "Prove" mark whose selected tooling — the Phase 2b Verification Tooling Selection, validated by a §A.6 Research artifact where the choice was uncertain — cannot actually discharge it. **A property known-unprovable at Gate 2 is fixed there** — re-architected, re-tooled, or de-scoped — and never proceeds; it is *not* a §A.16 case. The non-converged release path (§A.13/§A.16) is reserved **exclusively** for a property that **passed Gate 2 as provable** (tooling selected, §A.6 spike confident) yet **fails to discharge only when executed at Gate 5** — the foreseen-provable-but-execution-surprised case. This closes the loophole of declaring a property unprovable up front to reach §A.16: Gate 2 blocks that, so the only valid path to a documented limitation runs through a Gate-2 pass followed by a Gate-5 execution failure.

This table is the **non-waivable baseline**: a project's Constitution may tighten it — moving a Test-only property to Prove, or adding classes — but may never downgrade a Prove row to test-only.

**When proof tooling cannot discharge a Prove property** (beyond the concurrency row's bounded fallback): this is an architectural escalation (Phase 5), never a quiet downgrade to test-only. An undischarged Prove property leaves the **Verification dimension unconverged** — there is no signed-off exception that counts as passing. The Architect either (a) re-architects so the property becomes provable, (b) **de-scopes — drops or defers the feature requiring the unprovable property (the default, §A.16)**, or (c) consciously ships a **documented limitation** — which explicitly does *not* satisfy convergence for that property (Principle 10 is unmet, and the Zero-Slop claim is withheld for it), recorded as an honest non-convergence (a §A.13 record) and released, if at all, only via a **Non-Converged Release Authorization (§A.16)** after all of proving, re-architecting, and de-scoping are shown infeasible, never a waiver. A property also governed by a CSDD security clause retains its §A.1 MUST floor regardless.

---

## A.4 — Fuzzing Policy

Referenced from Phase 6 and the Gate-5 / convergence Verification criterion. A fuzz campaign against a deterministic-core target specifies:

- **Target** — the pure function, parser, or state machine under test (the effectful shell is not the fuzz target).
- **Budget** — **set in the Constitution** as two stop conditions that are both required: a **minimum effort** (≥ N CPU-hours or ≥ M executions) and a **coverage plateau** (no new coverage edge for a stated span). The plateau is stated in **executions, not wall-clock** (no new edge in the last K executions) so it is comparable across CI environments; a time-based plateau (no new edge in T minutes) is permitted only with the **execution environment pinned and executions/sec recorded** in the campaign result, since otherwise the same T means different effort on different hardware. The campaign runs until *both* the minimum effort is met *and* the plateau is reached; the plateau is part of the budget definition, not a separate condition that could conflict with it. A Constitution-set **maximum** wall-clock cap bounds the campaign so it always terminates: if the plateau is not reached by the cap, the campaign stops and this is a **blocking Gate 5 finding** — the Architect escalates to **rebudget-and-rerun** (raise the cap/effort), **re-scope the fuzz target** (a target too large to plateau within a feasible budget is usually under-decomposed), or treat the target's size as an **architecture problem to fix**. A fuzz-budget shortfall is a *fixable* verification gap (spend more / scope tighter), **not** a §A.13/§A.16 release-eligible limitation — unlike the undischarged-Prove and under-envelope classes, it does not reach the non-converged release path; it is fixed before Gate 5 passes.
- **Corpus** — a committed seed corpus; the coverage-guided corpus is persisted across runs so coverage compounds.
- **Sanitizers** — address/UB/leak sanitizers (or the language equivalent) enabled.
- **Crash triage** — every crash is minimised to a repro, captured as a regression test, and fixed; **no crash is carried open** into convergence.
- **Exit criterion** — the budget's minimum-effort and coverage-plateau conditions are both satisfied *and* zero un-triaged crashes remain. This is the operational meaning of the convergence row "fuzz ran to its agreed budget with no open crash."

---

## A.5 — Dependency / CVE Review Policy

Referenced from Phase 4 item 7 (Dependency Surface) and the Constitution's dependency hygiene policy. For any PR that adds or bumps a dependency, the Adversary checks:

- **Justification** — the addition traces to a spec requirement; the standard library / an existing dependency cannot serve.
- **Vulnerability scan** — an SCA tool (chosen in the Constitution — e.g. `osv-scanner`, Dependabot, Snyk) run with **timestamped output committed** (a redacted summary plus a retained CI-artifact link is permitted where the full output would leak private dependency metadata in a public repo).
- **Severity threshold** — set in the Constitution; default: no known **High/Critical** CVE in the resolved version. **Every known CVE is dispositioned regardless of severity**: a Low/Medium CVE is not auto-passed — it is fixed, or carried with a committed Architect accept-the-risk rationale. Severity decides what *blocks* merge (High/Critical by default) versus what merely *requires a recorded disposition*; it never lets a known CVE pass unexamined. A High/Critical breach the Architect consciously accepts **does converge**, under `PASS_ACCEPTED` (§A.7), as a `signed-off` or `accept-risk-deferred` finding (§A.8) listed explicitly in the convergence roll-up — "no severity cutoff that lets a defect ship" forbids *unexamined* passage, not *recorded, accepted* risk. (A CVE in a dependency on a CSDD MUST path is governed by that clause's non-waivable floor regardless, §A.1.)
- **Maintenance** — last release within a freshness window (Constitution-set), *or* a maintained-but-stable exception: a mature package with no recent release is acceptable where ongoing activity (issue triage, security response) is evidenced. Not archived/abandoned upstream.
- **Transitive surface** — new transitive dependencies noted; unexpected surface flagged.
- **Scan freshness** — the SCA scan has a Constitution-set TTL; if the committed scan is older than that window at merge or release, a re-scan is mandatory before proceeding. A stale scan is not evidence.

**Fail conditions.** An **unjustified addition** — a dependency with no spec / work-item trace — is **fixed-only** (Spec Supremacy, Principle 1; the Phase 4 dependency rule): it is removed, or a reviewed spec/work-item justification is added that re-enters review. It is **never signed off** — an untraceable dependency is a fidelity violation, not a risk to accept. The risk-acceptance fail conditions — a **severity-threshold breach** or an **abandoned upstream** — block unless the Architect signs off with a committed rationale. Each *signed-off* fail condition is recorded as a FIND-NNN (§A.8) with status `signed-off` or `accept-risk-deferred`, the Architect's committed sign-off, and a corresponding entry in the convergence roll-up (§A.7) — a dependency failure is never overridden by an unrecorded decision.

---

## A.6 — Research Artifact

Referenced from Phase 2b (Verification Tooling Selection). When the verification tooling for a required proof is **uncertain**, a Research artifact (a spike) is produced *before* the Verification Architecture commits to a tool. Uncertainty is not the Builder's discretion — it is triggered objectively when *any* of these holds: the first use of a given verifier in the repo; an unsupported language/property pair (no precedent that this tool discharges this property class); an unproven scale bound (the property must hold at a size the tool has not been shown to reach here); or no prior passing representative proof on record. If any trigger fires, the Research artifact is mandatory.

| Field | Required | Content |
|---|---|---|
| **RESEARCH-NNN** | yes | Unique identifier; cited by the Verification Architecture and the §A.7 record that consume it. |
| **Question** | yes | The uncertainty (e.g. "can Kani discharge this overflow-freedom property at our state size?"). |
| **Candidate tool(s)** | yes | The verification stack(s) under evaluation. |
| **Representative property** | yes | The actual property the spike attempts to prove. |
| **Result** | yes | Whether the tool discharges it, and the constraints it imposes on code structure. |
| **Acceptance criterion** | yes | What result counts as discharging the question (e.g. "the tool proves the representative property within the stated scale bound"). |
| **Evidence** | yes | The command(s) run and their output, or committed links, demonstrating the result. |
| **Decision** | yes | The tool selected and the structural constraints it imposes. *Admissible to the Gate 2 Adversary.* |
| **Rejected alternatives (list)** | yes | Which candidate tools were rejected — the bare list. *Admissible.* |
| **Rejected alternatives (rationale)** | yes | Why each was rejected — the deliberative reasoning. *Withheld* from the Gate 2 Adversary (exploration narrative, like the deliberation record). |
| **Approval** | yes | The Architect approval (who, when) — required before the conclusion is consumed. |
| **Consumed-by** | yes | The Verification Architecture (and its Gate 2 record) that consumes the conclusion. |

**Owner:** the Builder produces it; the Architect approves — the approval (who, when) is recorded with the artifact. **Location:** committed to a dedicated, versioned research path (e.g. `docs/research/<property-slug>.md`) and referenced from the Verification Architecture that consumes its conclusion. The Research artifact's *conclusion* (the tooling selection and its structural constraints) lands in the Verification Architecture, which **is** reviewed at Gate 2 — so the decision is gated even though the spike's exploration *narrative*, like the deliberation record, is human evidence and not an Adversary input.

**Admissibility split (so implementers know what to withhold).** Objective, **admissible** to the Gate 2 Adversary: *Representative property, Result, Acceptance criterion, Evidence, Decision,* and *Rejected alternatives (list)*. **Withheld** (exploration narrative, like the deliberation record): the *Question*'s framing deliberation and *Rejected alternatives (rationale)* — the Adversary sees *that* alternatives were rejected and the final Decision, not the deliberative story of why each was explored and dropped. The fields are separated above precisely so the boundary is enforceable: the objective set is gate evidence; the rationale field is human record, redacted from the admitted bundle.

---

## A.7 — Pass-Record Schema

Referenced from every gate (Gates 1–5), Phase 7 (Convergence), and Core Principles 8 and 11. A **pass record** is the committed evidence that a gate was cleared — the artifact a fresh session, an auditor, or the convergence roll-up reads to confirm a gate held. A gate without a committed pass record has not been passed, regardless of any actor's recollection (Principle 11). Storage location and file format are set by the project; the required fields are below.

**What PASS means (canonical).** A gate's **PASS** means every finding it produced is *dispositioned* — fixed, or (on the gates where sign-off is available — Gate 4 Pass 2 and Gate 5) carrying a committed Architect sign-off (accept-with-rationale, or `accept-risk-deferred`) — **not** that zero findings were raised. The verdict flips from FAIL to one of `PASS_CLEAN` / `PASS_FIXED` / `PASS_ACCEPTED` (see the Verdict field) once the findings are dispositioned, cited in *Resolved findings reviewed*. Two finding classes cannot be signed off: a CSDD MUST-security finding (fixed or compliance-verified only, §A.1) and an undischarged Prove-classified property (proven or re-architected, §A.3). Wherever the methodology says a gate "clears," "is clean," or "passes," it means this.

**Which gates may accept.** Derivation-fidelity gates — Gate 1, Gate 2, Gate 3, and Gate 4 Pass 1 — may close only `PASS_CLEAN` or `PASS_FIXED`: a fidelity gap between a derived artifact and its source is fixed, never signed off. **Gate 4 Pass 2** (quality / security / process / dependency), **Gate 5** (its fuzz, mutation, hardening-analyzer, and manual-exception findings), and tool findings generally (analyzer, CVE) may close `PASS_ACCEPTED`. Gate 5 is hybrid: it carries the final link of the derivation-fidelity chain — discharging the spec's Prove-classified invariants (Principle 9) — but that single element is the **non-acceptable** exception, while its other findings are tool verification and may be accepted. So acceptance everywhere remains subject to the two non-waivable classes: an undischarged Prove property is non-convergence, not acceptance (§A.3), and a CSDD-MUST finding is fix-or-compliance only (§A.1).

| Field | Required | Content |
|---|---|---|
| **Gate** | yes | Which gate this records (Gate 1–5), **Convergence (roll-up)** for the Phase 7 exit record, or **Governance: Constitution amendment** (a non-numbered governance gate, §A.2); plus the phase/step it sits at. |
| **Artifact(s) reviewed** | yes | The source and derived artifacts under review, each pinned to a commit SHA or content hash — so the record names *exactly* what was reviewed, not "the spec" in the abstract. This requires the source to be committed/hashed *before* the gate runs: Gate 1's source is the **committed Intent** (Phase 1), not a mutable external ticket — an uncommitted request is captured as a committed Intent file first. |
| **Reviewer** | yes | For Gates 1–4: the Adversary's identity (human name, or AI model + confirmation of context reset) and an explicit **independence attestation** with two distinct fields — (a) *artifact-production involvement* and (b) *prior-pass involvement* — whether the reviewer ran any prior adversarial pass on *this artifact at this gate*, which covers both the Gate 4 Pass 1→Pass 2 sequence **and any re-review of a revised artifact after a FAIL** (§II: the Adversary cannot approve its own prior suggestions); a reviewer who ran the prior pass is disqualified from the re-review. Each field is `none` or a description; both are required values, not optional. For an **AI** reviewer, a fresh context window discharges both. For a **human** reviewer, the attestation is backed by a pointer to the **reviewer-assignment record** (who assigned the review, when, and the reviewer's role on prior passes) — so independence is *checkable against recorded history*, not self-asserted; an attestation with no backing assignment record fails the gate for a human reviewer. **For Gate 5 (deterministic verification): the tool identity instead** — name, version, configuration, the seed/corpus/input hash, and the exact command — since the "reviewer" is a verifier with no goodwill to disclose. Gate 5's manual-judgment parts (equivalent-mutant justification, purity-boundary audit conclusions) additionally name the human reviewer, the Architect sign-off, and the committed evidence (the Principle 8 manual-exception rule). **For a `Governance: Constitution amendment` record:** the Adversary identity + independence disclosure, exactly as Gates 1–4 — the amendment is adversarially reviewed for whether it weakens a guarantee (§A.2). **For a `Convergence (roll-up)` record:** no Adversary — the roll-up is a deterministic check, owned and performed by the Architect; the field names the Architect who executed the roll-up, with no independence disclosure required (there is no derived artifact to review, only the assertion that every gate record is committed and no finding is open). |
| **Objective evidence** | yes | The commands run and their output — test-runner result, SAST/SCA output, CI status, proof/mutation/fuzz results — or links to those committed outputs. The evidence the verdict rests on (Principle 11). |
| **Resolved findings reviewed** | where prior FAIL records exist | The FIND-NNN dispositions (§A.8) this PASS relies on — the findings fixed or signed off since the last FAIL on this gate. Links the passing verdict to the dispositions that earned it; empty only on a first-pass clean gate. |
| **Enforcement matrix** | yes | Per gate criterion: the automated check that enforces it, or a committed rationale for why it must stay manual (Principle 8) — a manual entry names the **Architect as owner** of the automation-feasibility decision (*can* this be reduced to a deterministic check?) and the rationale for the "no". The absence of an automated check, *or* a manual claim with no owned feasibility rationale, is itself a gate failure the convergence roll-up flags. |
| **Architect approval** | yes | The Architect's sign-off on the gate decision (who, when) — the final authority's acceptance of the verdict and of any dispositions relied on. Required on every gate record and on the convergence roll-up. |
| **Verdict** | yes | One of: **`PASS_CLEAN`** — zero valid findings; *only* this verdict carries the *"Forced to manufacture flaws…"* declaration. The machine-checkable token is the **invariant prefix `Forced to manufacture flaws.`** — the trailing clause names the artifact class under review and varies with it (*Artifact(s) meet standard* / *Documents meet standard* / *Spec meets standard*), so automation keys on the prefix, never the full string. **`PASS_FIXED`** — every finding was fixed, none accepted. **`PASS_ACCEPTED`** — some findings carry a committed sign-off or deferral; the verdict lists the accepted risks (a "meet standard" declaration would be false, so it is not used). **`FAIL`** — open findings remain. *Gate 5:* each tool subrecord and manual-exception subrecord carries its own pass / fail; the *final* Gate 5 verdict uses the canonical enum (`PASS_CLEAN` when every subrecord is clean, else `PASS_FIXED` / `PASS_ACCEPTED` / `FAIL` per the dispositions), not an adversarial declaration. *Convergence roll-up:* the assertion of the full convergence evidence set — all five gate records committed, every finding dispositioned (none open), every required manual-acceptance record (§A.10) `executed`, and no Documented-Limitation (§A.13) open. |
| **Findings** | where applicable | The FIND-NNN ids (§A.8) *newly* raised in this review. Empty on a clean pass. |
| **Timestamp** | yes | When the review was performed — evidence is fresh, not recalled. |

A **convergence record** is a roll-up variant: its Gate field is `Convergence (roll-up)`, and it cites and asserts the completeness of *all* required convergence evidence, not the gate records alone:

1. **The five gate pass records** (its *Artifact(s) reviewed*).
2. **Every finding's disposition** (§A.8), with the accepted risks (`signed-off` / `accept-risk-deferred`) **enumerated explicitly** so no carried risk is hidden.
3. **Every `executed` manual-acceptance record** (§A.10) the Tests and Verification dimensions depend on — a `planned`-only record means those dimensions have not converged.
4. **No open Documented-Limitation record** (§A.13). A convergence roll-up is **full-convergence-only**: it asserts that *no* §A.13 record is open — nothing is unconverged. If a §A.13 record *is* open, there is **no roll-up**: the artifact has not converged and is released, if at all, only via a Non-Converged Release Authorization (§A.16), which cites the passed gates and the unconverged dimension(s) in the roll-up's place.

It asserts that all five gate records are committed, every finding is dispositioned (none open), every required manual-acceptance record is `executed`, and no Documented-Limitation is open — a deterministic check, carrying no adversarial verdict of its own beyond that assertion. A roll-up missing any of (2)–(3), or with any open §A.13 limitation, does not satisfy convergence even with all five gate records present; a roll-up exists *only* at full convergence, and a non-converged state is represented by §A.16, never by a roll-up.

A **Gate 4 record** is composite: a Pass 1 subrecord and a Pass 2 subrecord, each with its own reviewer and independence disclosure, linked by a final Gate 4 verdict that is PASS only when both subpasses pass. The Pass 2 subrecord's *Reviewer* field carries a required constraint beyond ordinary independence: it must disclose **no involvement in Pass 1** — the Pass 2 Adversary is a different reviewer (fresh context for an AI actor; a different person for a human actor) than the one who ran Pass 1, per Phase 4's Independence Reset. `none` (no prior Pass 1 involvement) is the only admissible value; any prior Pass 1 involvement fails the gate. Pass 1 may close only `PASS_CLEAN` / `PASS_FIXED`; Pass 2 may also be `PASS_ACCEPTED`.

A **Gate 5 record** is composite: one tool-result subrecord per deterministic check — **proof, fuzz, mutation, and each required security-hardening analyzer / crypto-edge-case suite that the §A.2 analyzer-ownership matrix assigns to Gate 5** — each carrying the tool-identity fields above, and for a hardening analyzer additionally its threshold, the findings it raised (FIND-NNN), and their dispositions; plus one manual-exception subrecord per human judgment (equivalent-mutant justification, purity-boundary audit conclusion), each carrying its reviewer, Architect sign-off, and committed evidence. The final Gate 5 verdict is PASS only when every subrecord passes.

A **reviewer-assignment record** backs the independence attestation for a *human* reviewer (the Reviewer field, above). Its required fields are minimal: the reviewer's identity; who assigned the review and when; and the reviewer's role, if any, on the artifact's production and on each prior pass. It is owned by the Architect (or the process owner the Architect names), stored in the evidence layout the Constitution declares (§A.2), and referenced by the pass record's Reviewer field — so a human reviewer's "no prior involvement" claim is checkable against recorded history, not self-asserted. For an **AI** reviewer a fresh context window discharges independence, so no assignment record is required.

### Worked example

```
PASS-RECORD
  Gate:       Gate 3 (Tests vs Spec) — Phase 3, before implementation
  Artifacts:  spec/order-pricing.md @ a1b2c3d
              tests/order_pricing_test.py @ a1b2c3d
  Reviewer:   AI Adversary (claude, fresh context)
              artifact-production involvement: none
              prior-pass involvement: none
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

Referenced from §II (Adversary), Phase 4, Phase 5, Core Principle 9, and the Phase 7 convergence rule. Every finding raised by an Adversary or by tooling (static analysis, fuzzer, mutation tester) gets one record; convergence is "every finding dispositioned," and this is the unit that carries the disposition. The record is what makes "no severity auto-pass" auditable: an open finding with no committed disposition blocks the gate. `fixed`, `compliance-verified`, `signed-off`, and `accept-risk-deferred` are all *closed* dispositions — only `open` blocks. "None left open" (Phase 7) therefore permits `accept-risk-deferred` and `signed-off` defects; the convergence roll-up (§A.7) lists every such accepted risk explicitly, so nothing unfixed is hidden. (`accept-risk-deferred` is the finding-disposition status; it is distinct from the work-item `deferred` status of §A.9, which schedules an item out of the current cycle.)

**Admissibility at a later gate.** When a prior pass's finding/disposition records are admitted as evidence to a fresh Adversary (§II), the *objective* fields are admissible — FIND-NNN, Affected identifiers, Class, Source, Location, **Description** (the concrete flaw itself), Severity, Status, and the **Objective evidence** field; only the **Disposition rationale** field (the Architect's reasoning behind a sign-off or deferral) is withheld commentary, like the deliberation record. The schema separates these into two fields *precisely so the boundary is enforceable*: the admitted bundle is the record with the Disposition-rationale field redacted — never a free-text "evidence" blob that smuggles the reasoning back in. The Adversary sees *that* a finding was dispositioned and how (the status), and the objective basis, but not the reasoning narrative behind it.

| Field | Required | Content |
|---|---|---|
| **FIND-NNN** | yes | Unique identifier, cited by the pass record (§A.7) and any linked work item. |
| **Source** | yes | What raised it — the Adversary (which gate), a tool (which analyzer / fuzzer / mutation run), or a **non-gating human review** (the Phase 3 Human Checkpoint, or a Builder Phase 3d self-review escalation). A human-review finding routes to the owning phase and is dispositioned like any other, but carries no gate verdict of its own — the checkpoint is non-gating (Phase 3). |
| **Affected identifiers** | yes | The REQ-NNN / SEC-NNN / ITEM-NNN this finding maps to, where one exists — one or more — driving the Phase 5 three-cycle escalation, which counts *per identifier* (a finding spanning several counts a cycle against each; escalation fires when any single identifier reaches three failed cycles). **Where the finding precedes requirement-level identifiers** — a Gate 1 SRS-completeness gap, an Intent gap, or a traceability gap surfaced before a REQ/ITEM is minted — it maps instead to the **artifact under review** (INTENT-NNN, the SRS, SDD-NNN, ITEM-NNN); if the fix mints a new REQ/ITEM, the finding is updated to map to it (later-mapping rule). A finding that names *neither* a requirement-level nor an artifact-level identifier is invalid — it must at least name what it is about. |
| **Location** | yes | Artifact + position, in the Adversary's `[Location — Topic]` form. |
| **Description** | yes | The concrete flaw. |
| **Severity** | yes | One of the required baseline enum — `blocker` (ships a defect or blocks a gate) / `major` (a substantive defect that should not ship un-dispositioned) / `minor` (cosmetic or wording) — set per the Constitution's severity policy. A project may add finer levels only as documented aliases that preserve this baseline mapping. Orders the work and informs the decision; never auto-passes (Phase 7). |
| **Class** | yes | `standard`, `CSDD-MUST` (a MUST-level security clause violation, §A.1), or `Prove-property` (an undischarged Prove-classified property, §A.3). The class sets which statuses are permitted. |
| **Status** | yes | `open` · `fixed` · `signed-off` (accept-with-rationale) · `accept-risk-deferred` (tracked follow-up with accept-the-risk) · `compliance-verified` (a *closed* status for `CSDD-MUST` only: a reviewer confirmed an alternative construction satisfies the clause, with committed evidence — not a code fix). Constraints by class **and gate**: a `standard` finding's available statuses depend on the gate that raised it — at a **derivation-fidelity gate** (Gate 1, Gate 2, Gate 3, or Gate 4 Pass 1) only `open` or `fixed`, since a fidelity gap is fixed, never signed off (§A.7); at **Gate 4 Pass 2, Gate 5, or for any tool finding** also `signed-off` or `accept-risk-deferred`. A `CSDD-MUST` finding may be only `open`, `fixed`, or `compliance-verified` — never `signed-off`/`accept-risk-deferred`; a `Prove-property` finding may be only `open` or `fixed` (proven or re-architected), and if shipped it is recorded as explicit non-convergence in a **Documented-Limitation record (§A.13)** outside any passing gate, never as a disposition. |
| **Disposition rationale** | where status ≠ `fixed` | The Architect's reasoning for the sign-off or deferral. |
| **Architect sign-off** | where status ∈ {`signed-off`, `accept-risk-deferred`} | Who signed and when — the committed sign-off the convergence rule requires. |
| **Linked item** | where status = `accept-risk-deferred` | The tracked follow-up work item (ITEM-NNN, §A.9) carrying the deferred fix. A deferral with no linked item is not a disposition. |
| **Objective evidence** | yes | The *objective* artifact only: the fix commit (for `fixed`), the tool output / minimised repro (for a tool finding), or — for `signed-off` / `accept-risk-deferred` — a pointer to the committed disposition record and any objective basis (e.g. the compensating control). The sign-off *reasoning* does **not** live here; it lives in **Disposition rationale**. Keeping the two fields separate is what makes the admissibility split (above) mechanically enforceable. |

### Worked example

```
FIND-031
  Source:        Adversary — Gate 4 (Pass 2, Code Quality)
  Affected:      REQ-077, ITEM-204
  Class:         standard
  Location:      [services/pricing.py:88 — error handling]
  Description:   Bare `except:` swallows the currency-conversion failure path;
                 no test covers the failed-conversion branch.
  Severity:      major
  Status:        fixed
  Objective evidence:  fix commit e4f5a6b — narrowed to `except ConversionError`,
                 added pricing_test.py::test_conversion_failure
```

---

## A.9 — Work-Item Schema

Referenced from §II (the Tracker), the Phase 1 decomposition bridge, and Phase 2 (Tracker Integration). A **work item** is the Tracker's atomic unit — the thing the issue-assignment hook (Principle 8) requires before any code edit, and the active-item pointer a fresh session reads to orient. The Tracker holds the work-item state; the repo holds the artifact content it points to (§VI).

| Field | Required | Content |
|---|---|---|
| **ITEM-NNN** | yes | Unique identifier; the active-item pointer the Tracker exposes to a context-reset session. |
| **Single responsibility** | yes | A one-line statement of the item's single responsibility. An item that cannot name one — or cannot deploy without a sibling — is not atomic and must be split before Phase 2 (decomposition bridge). |
| **Requirement links** | yes | The REQ-NNN(s) this item implements, plus any applicable `SEC-NNN` instances **once authored** in the SDD (Phase 2) — absent for a financial-only security-critical item with no CWE surface (§A.11). Every item traces to a requirement — the Tracker cannot invent requirements (§II). |
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
                   (approved A. Daw, 2026-06-27; rationale: handles PII in loyalty lookup)
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
| **Confirmation mode** | yes | `environment-visible` or `person-confirmed` (the confirmation-mode enum, VSDD.md Phase 1 Step 1a). |
| **Status** | yes | `planned` (authored at Gate 3, before code) or `executed` (performed against the built system). A scenario is covered at Gate 3 with `planned`; convergence requires `executed`. |
| **Owner** | yes | Who is responsible for the scenario; on a `planned` record this is the person who will execute it (no check has been performed yet). |
| **Environment** | where applicable | The build / environment the check ran against, pinned to a commit or release where possible. |
| **Steps** | yes | The concrete steps — **planned-until-executed**: at `planned`, the steps *to be performed* (reproducible by another person); at `executed`, those same steps confirmed as performed. |
| **Result** | yes on `executed` | Observed outcome against the scenario's expected `Then`. |
| **Executed reviewer + sign-off** | yes on `executed` | Who actually performed the check, with timestamp. The execution and its attestation **may be delegated** to a competent reviewer the Architect names — performing a manual check is evidence-gathering, not a gate decision. The Architect's *acceptance of that evidence into convergence* is **not** delegable (§II): the convergence roll-up (§A.7) records the Architect's approval of every `executed` manual-acceptance record it relies on. A delegated execution with no Architect acceptance at the roll-up does not count toward convergence. |

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

---

## A.11 — SDD (Software Design Document) Schema

Referenced from Phase 2 (Steps 2a–2c) and Gate 2. The SDD is the central Gate 2 artifact — the technical contract the Builder derives from the approved SRS. This schema is the required-field checklist the Gate 2 Adversary verifies against; the substance of each part is specified in Phase 2 prose and is not restated here.

| Field | Required | Content |
|---|---|---|
| **SDD-NNN / scope** | yes | Identifier and the unit of work (ITEM-NNN, §A.9) this SDD specifies. Names the SRS slice it derives from. |
| **Constitution version** | yes | The Constitution version this SDD is authored under (cited by every Spec, §A.2) — the governing artifact Gate 2 checks the SDD does not contradict. |
| **Behavioural contract** | yes | Preconditions, postconditions, and invariants (Step 2a). Each SRS requirement (REQ-NNN) is encoded here as a formal contract clause carrying its identifier through the chain. |
| **Interface definition** | yes | Input types, output types, error types — the OpenAPI/GraphQL schema or the module's type signature and doc contract. No ambiguity (Step 2a). |
| **Edge-case catalog** | yes | The per-input-type checklist (null, empty, boundary/maximum, negative/out-of-range, malformed/encoding, concurrent) for each input (Step 2a). Each edge case traces to a dedicated test; one first surfaced here is written back to the SRS as a versioned addendum (REQ-NNN minted there), not numbered in the SDD. |
| **Non-functional requirements** | yes | Performance bounds, memory constraints, and security considerations baked into the contract (Step 2a). |
| **Security-critical tag** | yes | The Architect-approved security-critical boolean (Step 2a), cited here with its **approver, timestamp, and one-line rationale** — mirroring the §A.9 work-item field, since the tag drives mandatory CSDD and proof obligations and the SDD is where they are discharged. `false` is a recorded value, not an omission. |
| **Security clauses** | where a CWE surface exists | The CSDD SEC-NNN clause *instances* (§A.1) applying the Constitution's clause templates to this work item — mandatory **per applicable CWE/security surface** wherever the tag is `true`; one clause guards one CWE (§A.1). Where the tag is `true` but no CWE-backed surface exists (e.g. a financial-only item, whose proof duties run under §A.3, not CSDD), record an explicit `none: no CWE-backed surface` rationale here rather than leaving the field blank. Absent where the tag is `false`. |
| **Provable-properties catalog** | yes | Each invariant/safety/correctness property with its §A.3 classification (Prove vs test-only) and the rule-row that justifies it (Step 2b). |
| **Purity boundary map** | yes | The deterministic pure-core / effectful-shell separation — module boundaries, dependency direction, state flow (Step 2b). Architect-approved before Gate 2. |
| **Verification tooling selection** | yes | The formal-verification stack chosen per property, the structural constraints it imposes, and a reference to any §A.6 Research artifact where the choice was uncertain (Step 2b). Architect-approved before Gate 2. |
| **Property specifications** | where Prove properties exist | The drafted formal property definitions (Kani harnesses, Dafny contracts, TLA+ invariants) — the mathematically precise second encoding of the spec (Step 2b). |
| **Architect approval** | yes | The Architect's approval of the Verification Architecture (purity boundary + tooling selection) — non-delegable (§II); Gate 2 reviews the Architect-approved version. |

The purity boundary and tooling selection are Builder *proposals* the Architect approves before Gate 2 (Phase 2b); the Behavioural Contract is the Builder's to author. The Gate 2 Adversary receives the SDD together with the SRS and Constitution (Step 2c).

---

## A.12 — TDD Compliance Log Schema

Referenced from Phase 3b (the log) and Gate 4 (the minimality check). The TDD Compliance Log is the audit trail the Adversary reads at Gate 4 to verify TDD discipline was *followed*, not merely claimed. One entry per requirement/test cycle, committed alongside the code.

| Field | Required | Content |
|---|---|---|
| **Entry id / links** | yes | The ITEM-NNN and the REQ-NNN (or SEC-NNN) this cycle satisfies, and the test ID it drives. |
| **Red evidence** | yes | The new work-item test failing before implementation — the command and its result against the baseline commit (the Red Gate, Phase 3). For a stub or platform-mandated scaffold with no forceable red state, the committed **no-red justification** stands in its place (Core Principle 3). For a **non-automatable scenario** (`environment-visible` / `person-confirmed`, §A.10), the §A.10 manual-acceptance record in `planned` state is the red-equivalent (Core Principle 3). |
| **Regression cycle** | for bug fixes | The Red → Green → Revert → Red sequence (Phase 3) — each of the four steps with its command and result — proving the test is tied to the defect. The code is left red for Gate 3; the temporary fix is recorded, not retained. |
| **Implementation** | yes | The implementation commit and the changed files. |
| **Green evidence** | conditional | **Automated scenario:** the test passing after implementation, and the full suite still green (command and result) — present *before* Gate 4. **Non-automatable scenario:** the §A.10 manual-acceptance record stays `planned` through Gate 3 and Gate 4 (its green-equivalent is not yet due) and reaches `executed` against the hardened build in **Phase 6**; the green-equivalent for a manual scenario is therefore verified at convergence, not at Gate 4. The TDD log records the §A.10 reference and is updated when the transition completes — Gate 4 reads it with the manual scenario's record still `planned`, which is correct, not a gap. |
| **Diff-scope justification** | yes | Per changed file: either *exercised by the linked test*, or a named supporting file the change legitimately requires (schema, config, dependency wiring, generated interface, shared helper) with its one-line reason. No file falls outside the work item's scope; any refactor sits in a separately-scoped Phase 3c commit, not folded in. |
| **Minimality verdict** | at Gate 4 | The Adversary's accept/reject of the minimality claim against the work-item-scope checklist (Phase 3b), recorded with rationale — the residual *was this line necessary?* judgment, not claimed as mechanical. |

---

## A.13 — Documented-Limitation (Non-Convergence) Record

Referenced from §A.3 (an undischarged Prove property; an under-envelope concurrency bound) and §A.8 (a `Prove-property` finding shipped unfixed). This record is the schema for an **explicit non-convergence** the Architect consciously ships — distinct from an `accept-risk-deferred` finding, which *is* convergence (a recorded, accepted risk on a dimension that otherwise passed). A Documented-Limitation record is the opposite: the dimension **does not converge**, and the release is labelled as such. It exists so that "we shipped without proving it" is a committed, auditable artifact, never a silent gap.

| Field | Required | Content |
|---|---|---|
| **LIMITATION-NNN** | yes | Unique identifier; cited by the §A.16 Non-Converged Release Authorization, **not** by a convergence roll-up (which is full-convergence-only and cannot exist while a limitation is open). |
| **Subject** | yes | What is unmet — exactly one of the **two eligible classes**: an **undischarged Prove property** (its REQ-NNN / SEC-NNN) that **passed Gate 2 as provable but failed to discharge at Gate 5 execution** (§A.3 — a property known-unprovable at Gate 2 is fixed there, never eligible here), or an **under-envelope concurrency bound** (§A.3). These are the *only* classes eligible for a Documented-Limitation (Phase 5, §A.16); no other convergence gap takes this route — everything else is fixed, de-scoped, or (for a CSDD MUST violation) compliance-verified. |
| **Dimension affected** | yes | Which convergence dimension is left unconverged (typically **Verification**). |
| **Why undischarged** | yes | The concrete reason — tooling cannot discharge the property at the required scale; re-architecture deferred; bound below envelope — with the evidence (the failed proof attempt, the §A.6 research result). |
| **Risk** | yes | What is *not* guaranteed: the specific failure mode shipped without proof, and its blast radius. |
| **Alternatives weighed** | yes | What was considered and why rejected — at minimum all three §A.16 routes: (a) prove, (b) re-architect until provable, and (c) **de-scope — drop or defer the feature (the default)**. Only with all three shown genuinely infeasible does shipping the limitation become eligible. Shows the decision was deliberate. |
| **Architect acknowledgement** | yes | Who, when — an explicit acknowledgement that this is **non-convergence, not a passing exception**. A CSDD MUST violation can *never* take this route (§A.1); it is for undischarged Prove properties and envelope shortfalls only. |
| **Release label** | yes | How the shipped artifact is marked: the release carries a visible "non-converged: LIMITATION-NNN" label for the affected dimension, so a downstream consumer sees the gap rather than inheriting a false "fully verified" claim. |
| **Revisit trigger** | yes | The condition that forces re-examination — tooling matures, scale changes, the property moves onto a regulated path. A limitation is not permanent by default. |

A convergence roll-up (§A.7) is **full-convergence-only**: it cannot exist while any Documented-Limitation record is open — an open limitation means the artifact has *not* converged, so there is no roll-up to assert. This is the mechanical meaning of "an undischarged Prove property is honest non-convergence, never a waiver" (§A.3, Principle 10). **Releasing** an artifact that carries an open Documented-Limitation is authorized only by a **Non-Converged Release Authorization (§A.16)**, which cites the passed gates and the unconverged dimension in the roll-up's place; the convergence roll-up cannot represent such a release, and there is no silent path to it.

---

## A.14 — SRS Schema (full and light tiers)

Referenced from Phase 1 Step 1a and Gate 1. The SRS is the Gate 1 artifact; this schema is the required-field checklist the Gate 1 Adversary verifies against. The tier is keyed to the decomposition unit (Phase 1): an **epic** gets the full SRS; a single **work item** gets the light SRS. The section substance is specified in Phase 1 prose and is not restated here.

**Common to both tiers:** every requirement carries a unique **REQ-NNN** — `SEC-NNN` identifiers belong to CSDD security-clause *instances* authored later in the SDD (§A.1), not to SRS requirements. A security-critical SRS requirement is a REQ-NNN that references the **security surface or `SECT-NNN` clause template** (Constitution register, §A.1) that will govern it; the `SEC-NNN` instances are minted in the SDD (Phase 2), so Gate 1 validates the surface/template reference — both of which exist before Gate 1 — not yet-unminted instances. Every requirement is **EARS-shaped** (SHALL/MUST, no *should/may/could/might*, VSDD.md Phase 1 Step 1a) and states **WHAT, not HOW**; every SRS requirement carries an explicit **scope marking** — `in-scope-now` or `deferred` (both REQ-NNN'd); a `deferred` requirement carries a linked tracked item (ITEM-NNN, §A.9) plus an accept-the-risk rationale and no trace this cycle. A **rejected** candidate (Phase 1 decision rule) is *not* an SRS requirement record at all — it has no REQ-NNN and lives in the ADR log with its rationale; the SRS requirements list contains only `in-scope-now` and `deferred` entries. The SRS cites the **Constitution version** it is written under and the **committed Intent** it derives from.

**Full SRS (epic-sized)** — the ISO/IEC/IEEE 29148 section set (Phase 1 Step 1a):

| Section | Required | Content |
|---|---|---|
| **Purpose & Scope** | yes | What the system is for and the boundary of this epic. |
| **Stakeholders** | yes | Each stakeholder's role, goals, and priority. |
| **Business Requirements** | yes | Each a goal with a measurable success criterion, MoSCoW-prioritised. |
| **Functional Requirements** | yes | Each captured as a user story — *As a [role], I want [capability], so that [benefit]* — for intent and context, then **decomposed into one or more EARS requirement statements**, each its own REQ-NNN, carrying the testable behaviour. The user story is the *why*; the EARS statements are the verifiable *what*. They are distinct forms: the EARS statement is not the user-story sentence reworded. |
| **Non-Functional Requirements** | yes | ISO/IEC 25010 quality categories, each with a measurable criterion. |
| **Constraints** | yes | Regulatory, technical, budget, and platform constraints that bound the solution space. |
| **Assumptions & Dependencies** | yes | Each with its impact-if-wrong. |
| **Acceptance Criteria** | yes | Gherkin scenarios for every *in-scope* requirement — at minimum every MoSCoW *Must*, plus any lower-priority requirement scheduled this cycle. |
| **Requirements Traceability Matrix** | yes | REQ-NNN → business requirement → acceptance criterion, the spine the downstream chain extends. |

**Light SRS (work-item-sized)** — the minimal set a single deployable unit needs (Phase 1 Step 1a):

| Field | Required | Content |
|---|---|---|
| **Inherited epic slice** | where born of an epic | A reference to the relevant slice of the parent epic SRS this item inherits. |
| **EARS requirements** | yes | The work item's own requirements in EARS format, each REQ-NNN. |
| **Gherkin acceptance criteria** | yes | One scenario per meaningful path, **each tagged with its confirmation mode** — `automated`, `environment-visible`, or `person-confirmed` (the closed enum, Phase 1 Step 1a). The mode determines whether the scenario maps to an executable test or a §A.10 manual-acceptance record at Gate 3. |
| **Dependencies & criticality** | yes | Named dependencies and the Architect-approved security-critical tag carried into the work item (§A.9). |

---

## A.15 — Intent Schema

Referenced from Phase 1 (the Intent artifact) and Gate 1. The Intent is the committed **source artifact** Gate 1 reviews the SRS against. It is committed (or content-hashed) — with its INTENT-NNN — **at intake, before deliberation begins**, so it is a fixed input rather than a moving target; commit-at-intake satisfies both "present before deliberation" and "pinned before Gate 1" (§A.7). It need not be formal, but the four content fields must be present before deliberation begins — a request missing its outcome or acceptance condition is sent back, not deliberated.

| Field | Required | Content |
|---|---|---|
| **INTENT-NNN** | yes | Unique identifier; pinned (commit SHA / content hash) and cited as the Gate 1 source artifact in the pass record. |
| **Problem / opportunity** | yes | The problem to solve or opportunity to capture. |
| **Desired outcome** | yes | What success looks like — the change the requester wants in the world. |
| **Requesting stakeholder / owner** | yes | Who is asking, and who owns the outcome. |
| **Acceptance condition** | yes | The condition that would make the work "done enough" — the bar Gate 1 checks the SRS expresses. |

The Phase 1 prose and this table are the **normative** definition of the Intent; there is no looser informal variant that bypasses the required fields.

---

## A.16 — Non-Converged Release Authorization

Referenced from §A.3, §A.13, and Phase 7. This is the **release path for an artifact that does *not* fully converge** — the missing terminal state that the convergence roll-up (§A.7) cannot represent, because the roll-up asserts that *all five* gate records passed and *no* finding is open. An undischarged Prove property (or an under-envelope concurrency bound) leaves Gate 5 unable to pass and the Verification dimension unconverged; such an artifact can still be released, but **only** by this explicit, Architect-authorized, clearly-labelled record — never by a convergence roll-up, and never silently.

A non-converged release is the deliberate exercise of §A.3 option (c): the Architect consciously ships a documented limitation, only after options (a) re-architect and (b) de-scope — and proving itself, the failed premise — are shown infeasible. It is distinct from the convergence roll-up in kind: the roll-up *certifies* convergence; this record *authorizes release despite its absence*. The gate machinery blocks **convergence**, not an Architect's labelled decision to release without it.

| Field | Required | Content |
|---|---|---|
| **RELEASE-NNN** | yes | Unique identifier for the non-converged release decision. |
| **Open limitations** | yes | The §A.13 Documented-Limitation record(s) this release ships with — each naming the unconverged dimension. |
| **Gate records** | yes | The gate pass records that *did* pass, and an explicit statement of which gate(s) / dimension(s) did **not** converge. |
| **Necessity justification** | yes | Why *all three* fix routes are genuinely infeasible within the project's real constraints — not merely harder or less convenient: (a) **proving** the property, (b) **re-architecting** so it becomes provable, and (c) **de-scoping** — dropping or deferring the very feature that requires the unprovable property. **De-scoping is the default expectation**: if the feature can be removed or deferred, it must be, rather than shipped unverified. This field is the "absolutely necessary" bar; a release without a defensible (c) justification is not authorised. |
| **Architect authorization** | yes | Who, when — **non-delegable** (§II). An explicit acknowledgement that this is a non-converged release of last resort, not a pass. |
| **Guarantee statement** | yes | An explicit declaration that this release does **not** carry the VSDD convergence / verification guarantee for the named dimension(s). |
| **Consumer label** | yes | How the shipped artifact is marked so a downstream consumer sees the gap (e.g. `non-converged: LIMITATION-NNN`) rather than inheriting a false "verified" claim — consistent with the §A.13 release label. |
| **Scope & re-authorization** | yes | This authorisation is scoped to **this release only** and does not carry forward: any subsequent version still carrying the limitation must re-authorise, re-justifying necessity against the §A.13 revisit trigger — a limitation can never silently ride along into future releases. |

**Non-waivable exclusion.** A CSDD MUST-security violation can **never** take this route — it is fixed or compliance-verified, never released open (§A.1). This path is exclusively for the §A.13 classes (undischarged Prove property, under-envelope concurrency bound), which are blocked by external tooling limits rather than by a fixable fidelity gap. A derivation-fidelity gap is never released this way either: it is fixed or de-scoped (Phase 5).

**Last resort, not a routine option.** Convergence is the default and expected terminal state; this path is the rare exception, reserved for when a property genuinely cannot be proven, re-architected, *or* de-scoped, yet the feature must ship. Repeated resort to it is itself a signal — like the three-cycle architectural escalation (Phase 5) — that the verification architecture or the project's scope is wrong, and warrants Architect review of the pattern, not just the individual release. A methodology that reaches for non-converged release routinely has stopped being "Verified" in any meaningful sense.
