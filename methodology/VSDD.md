# **Verified Spec-Driven Development (VSDD)**

## **The Fusion: VDD × TDD × SDD for AI-Native Engineering**

### **Overview**

**Verified Spec-Driven Development (VSDD)** is a unified software engineering methodology that fuses three proven paradigms into a single AI-orchestrated pipeline:

- **Spec-Driven Development (SDD):** Define the contract before writing a single line of implementation. Specs are the source of truth.
- **Test-Driven Development (TDD):** Tests are written *before* code. Red → Green → Refactor. No production behaviour exists without a failing test that demanded it — behaviour-changing edits included, behaviour-preserving refactors excepted (they run under the green suite); a further exemption covers code with no forceable red state, justified in writing rather than skipped (Core Principle 3).
- **Verification-Driven Development (VDD):** Subject all surviving code to adversarial refinement until every dimension is closed by committed evidence — every finding dispositioned, none left open.

VSDD treats these not as competing philosophies but as **sequential gates** in a single pipeline. The SRS defines *what*; the SDD defines the contract and architecture (the *how*); tests enforce the observable contract behaviour; adversarial verification surfaces what was missed. AI models orchestrate every phase by default, with the human developer serving as the strategic decision-maker and final authority.

VSDD is **actor-agnostic in its execution roles**: the Builder, Adversary, and Tracker can each be fulfilled by a human, an AI agent, or a combination of both. The **Architect is the deliberate exception** — the irreducible human authority that frames the problem, owns every gate decision, and accepts or rejects convergence; this role is not delegable to an AI (see the toolchain in §I and the Architect's 5Cs characterisation in §II). Where the document references AI models, this describes the most common implementation of the execution roles; the principles hold equally for human practitioners. A team working VSDD with no AI involvement would apply the same gates, the same traceability requirements, and the same adversarial independence constraints. The AI layer accelerates execution of the Builder, Adversary, and Tracker; the structure — and the human Architect at its head — is independent of how those three roles are executed.

---

### **I. The VSDD Toolchain**

| Role | Entity | Function |
| --- | --- | --- |
| **The Architect** | Human Developer | Strategic vision, domain expertise, acceptance authority. Signs off on specs, arbitrates disputes between Builder and Adversary. |
| **The Builder** | Claude (or similar) | Spec authorship, test generation, code implementation, and refactoring. Operates under strict TDD constraints. |
| **The Tracker** | AI agent or issue system | Hierarchical issue decomposition — Epics → Issues → Sub-issues. Every spec, test, and implementation maps to a work item. |
| **The Adversary** | Human reviewer or AI agent (no prior involvement) | Hyper-critical reviewer with zero tolerance. Reviews specs, tests, *and* implementation. Must have had no role in producing the artifact under review. |

---

### **II. Agent Roles — 5Cs Characterisation**

Each VSDD agent role is defined through the five dimensions that govern effective AI collaboration: **Constraints, Context, Curation, Conceptualization, Creativity** — a framework developed in *Five Categories of Human Excellence in the Age of AI* (Daw, 2026).[^5cs] The 5Cs were originally articulated as the surfaces where human judgment concentrates in human-AI collaboration; their application here to agent role definition demonstrates that they function as a general design language, not only a practice checklist.

#### The Architect *(human developer)*

**Constraints**
Final authority in the pipeline. Cannot delegate: scope decisions, quality goal definitions, ADR approval, verification-architecture approval (the purity boundary and tooling selection), or the convergence declaration. Bound by real-world constraints (regulatory, budget, team capacity). Must never accept a passing adversarial review as a substitute for their own judgment.

**Context**
Needs: business requirements, stakeholder expectations, and the converged spec — **and, for any gate finding they must disposition, the finding itself together with its objective evidence** (the failing check, the scanner output, the adversary's finding text, the pass record). Does *not* need the Builder's intermediate reasoning, the deliberation history, or a step-by-step implementation narrative — only the final artifacts and the evidence the decision turns on. Fresh context for each major decision prevents anchoring bias.

**Curation**
Selects which Adversary findings require spec revision versus which are acceptable risks to carry. Filters builder escalations: answers only what genuinely requires human judgment; delegates the rest back.

**Conceptualization**
Frames the problem as: *"What must be provably true about this system for it to be worth building?"* Thinks in quality goals, not implementation choices. Holds the tension between ideal and achievable.

**Creativity**
The only creativity in the pipeline that shapes the outcome. Generates the problem framing, the quality goals, and the decision to accept or reject convergence. The Architect's judgment is the irreducible human contribution.

---

#### The Builder *(Claude or equivalent AI)*

**Constraints**
Scope-bound to the spec — implements only what the spec authorises. Cannot make architectural decisions; surfaces ambiguities to the Architect rather than resolving them unilaterally. No implementation code without a prior failing test — behaviour-changing edits (including touched code) require a failing test; behaviour-preserving refactors instead run under the green suite in a scoped commit (Phase 3c); code with no forceable red state is exempt with a written justification (Core Principle 3). No commits to main; all work on branches with a PR required — enforced by branch protection rules and a pre-push hook that rejects direct pushes to main (Core Principle 8). In a non-Git or non-hosted environment the equivalent structural control applies: changes are isolated, independently reviewed before integration, and integration is blocked on a recorded gate pass — the mechanism varies, the requirement (no self-merged, unreviewed change) does not. Output authority is limited to: implementation, tests, and documentation updates.

**Context**
Needs: the converged spec, the test suite, and the current work item. Does *not* need stakeholder conversation history, prior failed approaches (anchors on wrong paths), or the Adversary's full review history. Fresh context per session is recommended to prevent accumulated bias.

**Curation**
From the spec: extracts only the requirements relevant to the current work item. From the test suite: identifies the specific failing test to satisfy. Filters out everything outside the current work item's scope — no opportunistic additions.

**Conceptualization**
Frames every task as: *"What is the minimal implementation that makes this test pass?"* Red-green-refactor, not "build the feature." Every line of code is a response to a specific test, which is a response to a specific spec requirement.

**Creativity**
Narrow and bounded: algorithm choice, code structure, naming — all within the spec's constraints. When implementation choices diverge due to genuine spec ambiguity, the Builder surfaces the decision to the Architect rather than choosing. The Builder's creativity is craft, not direction.

---

#### The Adversary *(human reviewer or AI agent, no prior involvement)*

**Constraints**
No prior relationship with the artifact — fresh context on every invocation, no accumulated goodwill. Cannot pass what doesn't meet the standard; "mostly good" is not a pass. Output format is non-negotiable: `[Location — Topic]: <concrete flaw> → <proposed correction>`. No preamble, no praise, no softening — the first word is the first flaw. If genuinely no flaws exist: exactly *"Forced to manufacture flaws. Artifact(s) meet standard."* — nothing more. **Standing gate:** invoked on every PR, not only at spec completion. Cannot approve its own prior suggestions — each review is independent.

**Context**
Receives the source and derived artifacts under review (e.g. the Spec and the PR diff) **plus the objective gate evidence the verdict turns on** — CI status, test-runner output, static-analysis and dependency-scan results, and the prior pass records being relied on. It does *not* receive the *subjective* framing: the deliberation record, the Builder's intent, the Architect's reasoning, the *narrative and reasoning* of prior reviews, or anything that explains *why* the artifact looks as it does. (The objective finding and disposition records from a prior pass — §A.8 — are admitted as evidence, as noted above; only their commentary is withheld.) The line is objective evidence (admitted, because a gate verdict requires it) versus derivation rationale (withheld, because it would let the reviewer probe against the specifier's reasoning instead of independently arriving at a verdict). The absence of that rationale is a feature: it simulates the hostile reader, the future maintainer with no institutional memory, and the production incident investigator.

**Curation**
Scans for: completeness gaps, measurability failures, internal contradictions, invisible assumptions, and failure path omissions. For PRs specifically: documentation currency, test coverage, traceability (does this change trace to a spec requirement?), process property adherence (branch used, CI green, docs updated), and **over-editing** — changes that exceed the scope of the fix. Does *not* curate for style preferences or non-falsifiable opinions.

*Over-editing defined:* a change over-edits when it modifies code beyond what the fix strictly requires — renaming variables, adding validation, restructuring logic, introducing new nesting or control flow. Every line changed that is *outside the work item's authorised scope* is an unrequested change and a review burden. Deliberate refactoring (Phase 3c) is legitimate — but it belongs in a separately-scoped commit, traceable to the work item and covered by the green suite, not folded into a fix diff where it hides behind the fix. The Adversary flags scope-exceeding changes with: `[Location]: change exceeds fix scope → revert, or split into a scoped refactor commit`[^over-editing].

**Conceptualization**
Frames every review as: *"What would break, be misunderstood, or be unprovable about this artifact in the hands of someone with no context?"* Represents the hostile auditor and the future maintainer simultaneously.

**Creativity**
Tightly constrained by design. The closest analogue is the ability to surface non-obvious failure modes — two correct-looking pieces whose interaction produces an incorrect whole. Generating *"Forced to manufacture flaws"* honestly is the hardest output: it requires genuine judgment that the standard has been met, not that review fatigue has set in.

---

#### The Tracker *(AI agent or issue system)*

**Constraints**
Cannot invent requirements — every work item traces to a spec requirement. Cannot approve implementation; that is the Adversary's gate. Scope is issue decomposition and traceability only; no architectural judgment. Must maintain the full chain: REQ-NNN (SRS) → Spec contract → Work Item → Test Case → Implementation. In team contexts, integrates with whatever issue tracking system the team uses — does not replace it.

Must enforce issue assignment before code edits — no implementation work begins without an active, assigned work item (work-item schema in **Appendix A §A.9**). This is an External Enforcement concern: the mechanism should be structural (a hook that blocks edits without an active issue) rather than instructional. A prompt to "always create an issue first" is not enforcement; a pre-edit hook that exits `1` without an active issue is.[^chainlink]

**Context**
Needs: the converged spec, the current implementation state, and the test suite. Does *not* need the Adversary's review history or architectural decision rationale — only the decisions themselves. In team contexts, also needs the current sprint and backlog state from the team's issue tracker.

The Tracker's state must expose the active work item to a fresh AI session with no conversational history. A context reset should impose zero re-orientation cost for identifying *what* is being worked on — the Tracker answers that. The substantive handoff note (what was done, what's next) lives in the repo, not the Tracker; the Tracker holds the pointer, the repo holds the content.[^chainlink]

**Curation**
Extracts atomic, independently testable units of work from the spec. Prioritises work items that unblock other work items — decomposition is dependency-aware. Flags work items where the spec is insufficiently specific to enable a test, surfacing the gap to the Architect rather than the Builder.

**Conceptualization**
Frames every task as: *"What is the smallest unit of work that is independently testable and traceable to the spec?"* The Tracker's mental model is the dependency graph, not the feature list. A well-decomposed backlog where every work item is atomic, testable, and traceable is the Tracker's convergence signal.

**Creativity**
Different decomposition strategies carry different risk profiles when spec changes arrive. The Tracker's creativity is in finding the slice that minimises rework. It also flags when decomposition reveals that two apparently separate work items are actually coupled — which is a spec gap requiring Architect attention, not a Builder workaround.

---

### **III. The VSDD Pipeline**

**Prerequisite (whole pipeline): the Constitution.** Before any feature work begins — before Phase 1 — the Architect establishes a project-level **Constitution**: the standing governing principles, architectural rules, and quality goals that all per-feature requirements and Specs must honour. The Constitution is a living document owned by the Architect; it does not change per feature. If a requirement or Spec would require violating the Constitution, the Architect must consciously amend the Constitution first rather than allowing silent exceptions.[^speckit] Its required sections and amendment process are templated in **Appendix A §A.2**.

**Dependency Hygiene Policy.** The Constitution MUST establish a project-wide dependency hygiene policy covering all features (it is a required Constitution section, §A.2; a project with no third-party dependencies satisfies it with a one-line statement to that effect). Minimum viable content: (1) a *justification requirement* — any new dependency must document what it provides that existing dependencies or the standard library cannot; (2) a *pinning strategy* — direct dependencies pinned via lock file; no floating version ranges in production artifacts; (3) a *review checklist* that the Adversary applies on every PR introducing a new dependency (see Phase 4, item 7). For projects on a security-critical path, the policy MAY extend to OpenSSF Scorecard requirements or equivalent maintenance and provenance criteria.[^openssf]

#### **Phase 1 — Requirements Refinement**

*Before the system is designed, the problem is made legible. Requirements are refined into an approved baseline — the SRS — and nothing is designed against requirements that have not survived their own gate.*

This is the requirements-refinement front-end: the disciplined analogue of a brainstorming pass.[^superpowers] It precedes all technical design. Its product is the **Software Requirements Specification (SRS)** — the business-facing statement of *what* the system must do and *why*, for stakeholders, Product, and QA. The *how* — architecture, interfaces, verification strategy — is a separate, later pass (Phase 2, the SDD). Keeping them apart is deliberate: requirements work must not stall on implementation decisions, and the build must not quietly redefine the requirement.

**The Intent artifact (input).** Phase 1 takes a minimal **Intent**: a short statement — a few sentences is enough — carrying at least four fields: the problem or opportunity, the desired outcome, the requesting stakeholder/owner, and the acceptance condition that would make the work "done enough." It need not be formal, but those fields must be present before deliberation begins, because Gate 1 reviews the SRS against this Intent. A request missing its outcome or acceptance condition is sent back, not deliberated.

**Step 1 — Deliberation**

A Socratic dialog agent — or a structured deliberation session — asks questions one at a time: clarifying ambiguous intent, surfacing implicit assumptions, identifying stakeholders and their goals, exploring alternative framings, and probing "what happens if X is wrong?" for each major requirement. Resolve nothing silently. The deliberation produces two outputs, and the boundary between them is critical:

1. **The SRS (Clarified Requirements).** Every implicit assumption, alternative interpretation, and intent clarification surfaced during deliberation is written explicitly into the requirements document. This enriched document — not the original requirements stub — is the input to Phase 2 and the artifact reviewed at Gate 1. The SRS is the Architect's intent made legible.

2. **ADR entries.** Rejected alternatives, reasoning behind significant decisions, trade-offs consciously accepted. Committed to the repository as Architecture Decision Records in a dedicated ADR log (arc42[^arc42] Section 9 — e.g. `docs/adr/`), referenced from but not contained in the Constitution (§A.2), as human-readable records for the Architect and future maintainers.

**What the Adversary does NOT receive:** the deliberation record or ADR content. The Adversary at every gate receives only the source artifact and the artifact derived from it — at Gate 1, the original feature request and the SRS; nothing more. This boundary is not a convenience; it is the mechanism that preserves the Adversary's independence. An Adversary that knows *why* a requirement was written the way it was will probe against the specifier's reasoning rather than independently arriving at whether the conclusion is sound. The gap between what the specifier intended and what the Adversary independently finds *is* the value of the gate. Collapsing that gap by sharing the deliberation defeats the purpose.[^superpowers]

**Mockups as elicitation.** For requirements that are easier to *see* than to describe — anything operator- or UI-facing — a low-fidelity mockup (a throwaway HTML/CSS page, a wireframe, a clickable prototype) is often the fastest way to settle intent with stakeholders. A business owner who cannot articulate a requirement in the abstract will react decisively to a concrete screen, and the disagreements surface while they are still cheap to resolve. The mockup is an **elicitation aid, not a design commitment**: what it surfaces is written back into the SRS as observable behaviour (the *what*), and the mock itself is throwaway — it does not constrain the SDD's implementation choices (the *how*), and it is not an Adversary input. Treat it like the deliberation record — a human-facing instrument for reaching agreement, discarded once that agreement is captured as requirements.

**Step 1a — Authoring the SRS (tiered to the unit of work)**

The weight of the SRS is keyed to the decomposition unit:

- **Epic-sized work** — a requirement that will fan out into multiple independently-deployable work items — gets the **full SRS**: a structured requirements document along the lines of ISO/IEC/IEEE 29148.[^iso29148] Its sections: Purpose and Scope; Stakeholders (role, goals, priority); Business Requirements (each a goal with a measurable success criterion, MoSCoW-prioritised); Functional Requirements (user stories — *As a [role], I want [capability], so that [benefit]*); Non-Functional Requirements (ISO 25010[^iso25010] quality categories, each with a measurable criterion); Constraints; Assumptions and Dependencies (with impact-if-wrong); Acceptance Criteria (Gherkin) for every *in-scope* requirement — at minimum every MoSCoW *Must* (priority, distinct from EARS SHALL/MUST obligation), plus any lower-priority requirement scheduled for this cycle; a requirement not scheduled is explicitly marked out-of-scope and carries no test or implementation trace; and a Requirements Traceability Matrix. The epic-level SRS is the artifact that *feeds the decomposition* into work items.

- **Work-item-sized work** — a single, independently-deployable unit — gets the **light SRS**: EARS-format requirements plus Gherkin acceptance criteria, grouped by **confirmation mode** — a closed enum of `automated` (an executable test), `environment-visible` (observable in a running environment), or `person-confirmed` (requires human judgement). A work item born from an epic inherits the relevant slice of the epic SRS and adds only its specifics.

Requirements are written in **EARS format** (Easy Approach to Requirements Syntax)[^ears] — five fill-in-the-blank patterns that reduce modal ambiguity by mandating SHALL/MUST and forbidding *should*, *may*, *could*, *might* (modal discipline narrows how a requirement can be read; it does not by itself remove semantic ambiguity):
  - *Ubiquitous:* `The system SHALL <action>.`
  - *Event-Driven:* `WHEN <trigger>, the system SHALL <action>.`
  - *State-Driven:* `WHILE <state>, the system SHALL <action>.`
  - *Optional Feature:* `WHERE <feature is included>, the system SHALL <action>.`
  - *Unwanted Behaviour:* `IF <condition>, THEN the system SHALL <response>.`
Acceptance criteria are written as **Gherkin** scenarios (*Given / When / Then*), one per meaningful path. Each requirement receives a unique identifier (REQ-NNN) that traces through the full chain: REQ-NNN → spec contract → test case → implementation → adversarial review → formal proof (the final step only where the property is Prove-classified per §A.3; non-critical requirements terminate at test coverage and adversarial review).

**Describe WHAT, never HOW.** A requirement states observable behaviour — inputs, outputs, system responses — that a tester could verify *without reading the code*. If you cannot verify it without opening the implementation, it is HOW, not WHAT: class hierarchies, internal patterns, framework names, and coverage thresholds are design detail and belong to the SDD (Phase 2), not the SRS. This boundary is the load-bearing seam between Phase 1 and Phase 2.

**Decomposition bridge.** When the SRS describes an epic, it is cut into atomic, independently-deployable work items before Phase 2 begins — each work item carrying its own light SRS (its slice of the epic SRS plus specifics), its dependencies named, and its criticality tagged. Decomposition is dependency-aware (the Tracker's role; see §II). A "work item" that cannot name its single responsibility or cannot deploy without a sibling is not yet atomic — split it before it enters Phase 2.

**Step 1b — SRS Review Gate (Gate 1 — SRS Fidelity Review)**

The SRS is reviewed by *both* the human and the Adversary before any technical spec is written. The Adversary receives the original feature request, the committed Constitution (needed for the non-contradiction check against its quality goals), and the SRS — and no subjective framing: no deliberation record, no ADR, no architectural reasoning. This is Gate 1 in the Derivation Fidelity chain (Core Principle 9), and the gate most commonly skipped because it precedes the first design decision. The Adversary checks that every requirement is:

- **Unambiguous** — EARS-shaped, no *should/may/could*; it cannot be read two ways.
- **Testable without code** — verifiable by observing behaviour, not by reading the implementation.
- **Complete** — no missing stakeholder, no unhandled edge case, no NFR left implicit (null / empty / maximum / concurrent behaviour stated where it matters).
- **Non-contradictory** — no requirement conflicts with another or with the Constitution's quality goals.
- **WHAT, not HOW** — no design or implementation detail has leaked into the requirement.

The SRS is iterated until the Adversary can find no legitimate holes. **No technical spec authorship (Phase 2) begins until Gate 1 is cleared and the Architect signs off** — the approve-before-design gate. Clearing a finding means resolved-and-applied or explicitly accepted by the Architect, not merely acknowledged. Enforce structurally: a pre-Phase-2 hook that checks for a committed Gate 1 pass record (Core Principle 8).

---

#### **Phase 2 — Spec Crystallization**

*Nothing gets built until the contract is airtight — and the architecture is verification-ready by design.*

With an approved SRS in hand, the Builder produces a **formal specification document** — the **Software Design Document (SDD)** — for each unit of work. This phase encodes the SRS's requirements into a technical contract for developers, architects, and reviewers: it does not merely restate *what* the software does — it defines *how* it is built and *what must be provable about it*, and structures the architecture accordingly.

**Step 2a: Behavioural Specification**

The Builder encodes the SRS's requirements into the functional contract:

- **Behavioural Contract:** What the module/function/endpoint *must* do, expressed as preconditions, postconditions, and invariants. Each EARS requirement from the SRS (REQ-NNN) is encoded here as a formal contract clause; the identifier carries through to the test case, implementation, adversarial review, and — where the property is Prove-classified (§A.3) — formal proof.
- **Interface Definition:** Input types, output types, error types. No ambiguity. If it's an API, this is the OpenAPI/GraphQL schema. If it's a module, this is the type signature and doc contract.
- **Edge Case Catalog:** Explicitly enumerated boundary conditions, degenerate inputs, and failure modes. Exhaustiveness is bounded by a per-input-type checklist — for each input the Builder walks: null, empty, boundary/maximum, negative/out-of-range, malformed/encoding, and concurrent (where the input can be touched in parallel). Gate 3 verifies the checklist is covered, not that the Builder "tried hard." Edge cases already enumerated in the SRS carry their existing REQ-NNN; any edge case first surfaced here is written back into the SRS as a versioned addendum and minted a REQ-NNN there, not numbered independently in the SDD. That addendum re-enters Gate 1 for fresh review before Phase 2 continues, per Artifact Locking (Phase 4) — a new requirement is not exempt from the gate that governs requirements. Each traces to a dedicated test.
- **Non-Functional Requirements:** Performance bounds, memory constraints, security considerations baked into the spec itself.
- **Security Clauses (security-critical paths):** A work item is **security-critical** if it touches authentication or authorisation, handles secrets or regulated/PII data, performs financial calculation, or sits on a trust boundary (parses untrusted input or crosses a privilege boundary) — a boolean tag the **Architect approves** for *every* work item before Phase 2 (the Tracker records and enforces it, but the criticality judgment is the Architect's, not the Tracker's — it determines mandatory CSDD/proof obligations): set at epic decomposition where the item came from an epic, or at intake for a standalone work item. It is never left to be decided later during implementation. For any work item carrying that tag, the Behavioural Contract includes security clauses in **CSDD (Constitutional Spec-Driven Development)** format[^marri] — Marri's pattern of encoding security constraints as versioned, machine-readable spec clauses. Each clause has a SEC-NNN identifier, a CWE reference (e.g., CWE-89 SQL Injection), a MUST/SHOULD/MAY level, an implementation pattern, and an enforcement mechanism (static analysis rule, merge blocker). The full schema — level semantics, valid enforcement mechanisms, and a worked SEC-NNN example — is in **Appendix A §A.1**. MUST-level violations reject the implementation and require a rewrite; the SHOULD and MAY level semantics are normative in §A.1. This layer is optional for non-security-critical features and mandatory for those that are. Empirical basis: in Marri's banking-microservices case study, constitutional security constraints were associated with a 73% reduction in security defects versus unconstrained AI generation, with no reported velocity degradation.[^marri] It is a single case study; treat the figure as indicative, not a guaranteed general result.

**Step 2b: Verification Architecture**

Before any implementation design is finalised, the Builder produces a **Verification Strategy** that answers: *"What properties of this system must be mathematically provable, and what architectural constraints does that impose?"*

This includes:

- **Provable Properties Catalog:** Which invariants, safety properties, and correctness guarantees must be formally verified — not just tested? Examples: "This state machine can never reach an invalid state." "This arithmetic can never overflow." "This parser always terminates." "This access control check is never bypassed." The Builder distinguishes between properties that *should* be proven (critical path, security boundaries, financial calculations) and properties where test coverage is sufficient (UI formatting, logging, non-critical defaults); the prove-vs-test decision is rule-based, not taste — see the decision table in **Appendix A §A.3**.
- **Purity Boundary Map:** A clear architectural separation between the **deterministic, side-effect-free core** (where formal verification can operate) and the **effectful shell** (I/O, network, database, user interaction). This is the most consequential design decision in VSDD — it dictates module boundaries, dependency direction, and how state flows through the system. The pure core must be designed so that verification tools can reason about it without mocking the entire universe.
- **Verification Tooling Selection:** Based on the language and the properties to be proven, the Builder selects the appropriate formal verification stack (Kani for Rust, CBMC for C/C++, Dafny, TLA+ for distributed systems, etc.) and identifies any constraints these tools impose on code structure. This happens *now*, not after the code is written, because tool constraints are architectural constraints. Where tooling selection is uncertain, a **Research artifact** is produced first — a spike that validates the chosen tool against a representative property before the full verification architecture commits to it. The Research artifact records spike results, the tool decision, and reasons alternatives were rejected; it is committed to the repository alongside the Constitution and Spec.[^speckit] Its fields, owner, and acceptance are defined in **Appendix A §A.6**.
- **Property Specifications:** Where possible, the Builder drafts the actual formal property definitions (e.g., Kani proof harnesses, Dafny contracts, TLA+ invariants) alongside the behavioural spec. These aren't implementation — they're the formal expression of what the spec already says in natural language. They serve as a second, mathematically precise encoding of the requirements.

Because the purity boundary and tooling selection are architectural decisions, they are not the Builder's to commit (§II): the Builder produces the Verification Architecture as a **proposal**, and the Architect approves it before Gate 2. The Builder may not unilaterally finalise the architecture; Gate 2 reviews the Architect-approved version.

**Why this must happen in Phase 2:** If the system is designed with side effects woven through the core logic, no amount of Phase 6 heroics will make it verifiable. A function that reads from a database, performs a calculation, and writes to a log in one block cannot be formally verified without mocking infrastructure that the verifier may not support. But a function that takes data in, returns a result, and lets the caller handle persistence — that's a function a model checker can reason about. This boundary must be drawn at the spec level because it fundamentally shapes the module decomposition, the dependency graph, and the testing strategy that follows.

**Step 2c: Spec Review Gate (Gate 2 — Spec Fidelity Review)**

The complete spec — behavioural contracts *and* verification architecture — is reviewed by *both* the human and the Adversary before any tests are written. The Adversary receives the approved SRS (Phase 1) and the Spec. It receives no subjective framing — no deliberation record, no ADR, no reasoning behind spec decisions — but it does receive the objective evidence its verdict needs, including any §A.6 research result bearing on whether the selected tooling can discharge a Prove property. This is Gate 2 in the Derivation Fidelity chain (Core Principle 9).

The Adversary tears into the spec looking for:

- Ambiguous language that could be interpreted multiple ways
- Missing edge cases
- Implicit assumptions that aren't stated
- Contradictions between different parts of the spec
- **Properties claimed as "testable only" that should be provable** (the Adversary pushes back on lazy verification boundaries)
- **Purity boundary violations** — logic marked as "pure core" that actually depends on external state
- **Verification tool mismatches** — properties the selected tooling can't actually prove

The spec is iterated until the Adversary can't find legitimate holes in either the behavioural contract or the verification strategy. This gate should be enforced structurally: no test suite generation begins until a recorded Adversary pass on the spec is committed to the repository. A pre-Phase-3 hook that checks for this record is the structural implementation (Core Principle 8).

**Tracker Integration:** Each spec maps to a work item. Sub-items are generated for each behavioural contract item, edge case, non-functional requirement, *and* each formally provable property. The provable properties get their own work item chain so their status is tracked independently from test coverage.

---

#### **Phase 3 — Test Generation & TDD Implementation (The TDD Core)**

*Red → Green → Refactor, enforced as a hard constraint (by AI in the common implementation).*

With an airtight spec in hand, the Builder now writes tests — and *only* tests. No implementation code yet.

**Step 3a: Test Suite Generation**

The Builder translates the spec directly into executable tests:

- **Unit Tests:** One or more tests per behavioural contract item. Every postcondition becomes an assertion. Every precondition violation becomes a test that expects a specific error.
- **Edge Case Tests:** Every item in the Edge Case Catalog becomes a test. These are the tests that catch the bugs that "never happen in production" (until they do).
- **Integration Tests:** Tests that verify the module works correctly within the larger system context defined in the spec.
- **Property-Based Tests:** Where applicable, the Builder generates property-based tests (e.g., using Hypothesis, fast-check, or proptest) that assert invariants hold across randomised inputs.

**The Red Gate:** Every newly written test for the current work item must *fail* before any implementation begins, while the pre-existing suite stays green. (Even in a greenfield project this means *all newly-written work-item tests* fail while any pre-existing scaffolding or library tests stay green — not literally "every test in the repo fails"; in an existing codebase only the new work-item tests are expected to be red, the rest must remain green, and a regression there is itself a finding.) If a new work-item test passes without implementation, it is suspect — either testing the wrong thing or the spec was wrong — and the Builder flags it for human review. This gate should be enforced structurally: a pre-implementation hook that verifies the work item's new tests are present and failing against the baseline before allowing code edits, consistent with External Enforcement over Persuasion (Core Principle 8). The one case the hook accepts in place of a failing test is a committed **no-red justification** (Core Principle 3) — for a stub or platform-mandated scaffold with no forceable red state; the Adversary confirms at Gate 3 that the justification is genuine, not an evasion.

**Regression Test Verification (Red–Green–Revert cycle):** For bug fixes, the Red Gate has a stricter form. After writing the regression test: (1) confirm it *fails* on the broken code; (2) apply the fix and confirm the test *passes*; (3) *revert* the fix and confirm the test *fails* again; (4) leave the code in the reverted (red) state for Gate 3. A regression test that passes before the fix is applied was never testing the right thing — it cannot catch a regression. Only the four-step Red → Green → Revert → Red sequence proves the test is genuinely tied to the defect it is meant to guard against. The temporary apply-and-revert in steps 2–3 is a **controlled exception** to the no-implementation-before-Gate-3 rule: the fix is applied *only* to validate the test, the cycle (commands and results) is committed as Gate 3 evidence, and the permanent implementation still waits until Gate 3 passes. Gate 3 reviews the validated, red regression test — not the temporary fix.

**Gate 3 — Tests vs Spec (before any implementation).** With the suite written and red, a fresh-context Adversary reviews the tests against the Spec, receiving those two artifacts plus the objective Red-Gate evidence its verdict rests on — the test-run output, the baseline commit, and any committed no-red justifications. *Verdict:* every behavioural-contract item and every `automated` Gherkin scenario maps to an executable test, while `environment-visible` and `person-confirmed` scenarios (collectively, manual-confirmation) map to a defined manual-acceptance evidence record (§A.10) rather than an executable test; each test is a faithful derivation of the acceptance criteria, not of an assumed implementation; every specified branch or path in the Spec and Gherkin scenarios is covered; no test is tautological or over-mocked; the Red Gate holds. Findings return to Step 3a (fix the tests) or Phase 2 (fix the Spec). No implementation is written until Gate 3 has a committed pass record (Core Principle 8). Reviewing the tests *here* — before code exists — is what makes the gate real: the reviewer cannot rationalise a test to match an implementation it has never seen.

**Step 3b: Minimal Implementation**

The Builder writes the *minimum* code necessary to make each test pass, one at a time. This is classic TDD discipline:

1. Pick the next failing test.
2. Write the smallest implementation that makes it pass.
3. Run the full suite — nothing else should break.
4. Repeat.

**TDD Compliance Log:** The Builder records, for each requirement, the mapping: failing test → implementation → test pass, with the change made reviewable — the changed files, the linked test ID, and a one-line justification that the diff is confined to satisfying that test. "Minimal" is then checkable against this record, not self-certified: the Adversary accepts or rejects the minimality claim at Gate 4 against a work-item-scope checklist — every file in the diff is either exercised by the linked test or is a supporting file the change legitimately requires (schema, config, dependency wiring, generated interface, shared helper), each such file named and justified in the TDD log; no change falls outside the work item's scope; and any refactoring is split into a separately-scoped commit (Phase 3c), not folded into the fix. What remains after those checks — whether a given line was *necessary* — is the Adversary's judgment, recorded with its rationale in the pass record, not claimed as a purely objective measure. This log is committed to the repository alongside the code. It is not documentation after the fact — it is the audit trail that the Adversary checks when verifying that TDD discipline was followed in practice, not merely claimed.[^rlm]

**Step 3c: Refactor**

After all tests are green, the Builder refactors for clarity, performance, and adherence to the non-functional requirements in the spec. The test suite acts as the safety net — if refactoring breaks something, the tests catch it immediately.

**Human Checkpoint:** The developer reviews the test suite and implementation for alignment with the "spirit" of the spec. AI can miss intent even when it nails the letter of the contract. This is **non-gating advice**, not a gate — it produces no pass record and blocks nothing; a concern it surfaces becomes an ordinary finding routed to the owning phase. The gates are Gates 1–5; this checkpoint is a human sanity check, not one of them.

**Step 3d: Builder Self-Review**

Before handing off to the Adversary, the Builder performs a self-critique pass against the spec. This is not a replacement for adversarial review — it is a pre-flight check that surfaces issues the Builder can identify from its own position. Prompt: *"Review your implementation against the spec. Identify anything incomplete, inconsistent with the spec, or likely to fail adversarial scrutiny. Fix what you can; escalate what cannot be resolved without Architect input."* Self-review with explicit prompting surfaces issues the Builder is positioned to catch before external review; the Adversary then focuses on what self-review cannot reach. (Self-Refine[^self-refine] demonstrates iterative self-feedback improving model outputs across a range of tasks — VSDD adapts the pattern as a pre-flight check, not as a substitute for adversarial review.)

---

#### **Phase 4 — Adversarial Refinement**

*The code survived testing. Now it faces the Adversary.*

The verified, test-passing codebase — along with the spec and test suite — is presented to the Adversary in a fresh context window. This is a **standing gate**: the Adversary runs on every PR, not only at spec completion. The gate should be enforced structurally — a CI check or pre-merge hook that blocks the merge/release path without the complete gate chain (Gate 4 here, then Gate 5 and the convergence roll-up) — not by relying on the Builder to remember to invoke it (Core Principle 8).

Phase 4 runs as **two sequential passes**. Pass 2 is not dispatched until Pass 1 closes as `PASS_CLEAN` or `PASS_FIXED` — its findings *fixed* by returning to the owning phase, not merely signed off; a spec-fidelity gap is corrected, not accepted (unlike Pass 2's quality findings, which may be dispositioned by sign-off per the canonical PASS rule). In verdict terms (§A.7), Pass 1 may close only as `PASS_CLEAN` or `PASS_FIXED`; `PASS_ACCEPTED` is available only to Pass 2. This separation keeps each reviewer's question narrow and prevents code quality findings from displacing spec compliance gaps. Both passes together constitute Gate 4: Pass 1 is its derivation-fidelity check (Implementation vs Spec + Tests — the check Core Principle 9 names), Pass 2 its quality, security, process, and dependency check. Gate 4 clears — permitting the work to **enter Phase 6 (formal hardening)** — only when both passes are dispositioned: every Pass 1 finding *fixed* (Pass 1 cannot be signed off), and every Pass 2 finding fixed or carrying a committed Architect sign-off (the canonical PASS rule, §A.7) — not necessarily zero findings. **Gate 4 is not merge authority:** merge and release remain blocked until Gate 5 and the Phase 7 convergence roll-up are also committed. The code is verified before it ships, not after.

**Pass 1 — Spec & Test Compliance (Gate 4)**

The Adversary reads the implementation directly, against **both the Spec and the test suite** (Gate 4 — Spec + Tests → Implementation). It does *not* take the Builder's summary of what was done at face value — the Builder's report describes intent; the code describes fact. Discrepancies between the implementation and either the Spec or the tests are findings. The Adversary verifies:

1. **Spec Fidelity:** Does the implementation actually satisfy the spec, or did the tests inadvertently encode a misunderstanding? The Adversary treats the spec as a constitution — borrowing the framing of Constitutional AI[^constitutional] as an analogy, not as evidence (there the "constitution" governs model training; here it is the behavioural spec, enforced by adversarial review rather than RL). The implementation must satisfy the spec fully and explicitly, not approximately. There is no partial credit for "mostly implemented" or "intended to satisfy" — either the requirement is met, demonstrably, or it is not.
2. **Spec Gaps Revealed by Implementation:** Sometimes writing the code reveals that the spec was incomplete. The Adversary looks for implemented behaviour that isn't covered by the spec — and for spec requirements that have no corresponding implementation the Builder failed to mention.

Pass 1 findings return to the phase that owns the gap — Phase 1 for a requirements-level gap (re-reviewed at Gate 1), Phase 2 for a spec gap (Gate 2), or Phase 3 for a test or implementation gap — before Pass 2 is run. This mirrors the Phase 5 feedback routing; a requirements-level gap is never patched at the spec or code layer.

**Pass 2 — Code Quality** *(only after Pass 1 passes)*

3. **Test Quality:** Are the tests actually testing what they claim? Are there tests that would pass even if the implementation were subtly wrong? (Tautological tests, tests that mock too aggressively, tests that assert on implementation details rather than behaviour.)
4. **Code Quality:** Placeholder comments, generic error handling, inefficient patterns, hidden coupling, missing resource cleanup, race conditions.
5. **Security Surface:** Input validation gaps, injection vectors, authentication/authorisation assumptions.
6. **Process Properties:** For PRs — branch used, CI green, documentation updated, change traceable to a spec requirement.
7. **Dependency Surface:** For any PR that adds a new dependency or bumps an existing one — is the addition or version change justified by the spec? Does it respect the Constitution's dependency hygiene policy? Are there known CVEs in the current version? Is the package actively maintained, or abandoned upstream? Does the transitive graph introduce surface area the spec did not anticipate? The Adversary flags any dependency addition that lacks an explicit justification traceable to a spec requirement or that fails the Constitution's hygiene checklist. An AI-generated implementation that silently reaches for a third-party package to solve a problem the standard library could handle is an over-scoped dependency, not a Builder judgment call — flag it the same way over-editing is flagged.[^dekens] The review checklist — scanner, severity threshold, freshness window, and fail conditions — is in **Appendix A §A.5**.

**Negative Prompting:** The Adversary is configured for zero tolerance. No "overall this looks good, but..." preamble. Every piece of feedback is a concrete flaw with a specific location and a proposed fix or question.

**Independence Reset:** The Adversary invoked for each pass must have had no involvement in producing the artifact under review, and no involvement in the prior pass. For AI actors: fresh context window. For human actors: independent reviewer assignment — someone who was not present at prior review sessions. No relationship drift. No accumulated goodwill. (See Core Principle 7 — Entropy Resistance.) On small teams where a fully uninvolved human is unavailable, the reviewer order is: (1) a different person who did not produce the artifact; otherwise (2) an independent AI Adversary in a fresh context — which an AI-native pipeline can always provide. **The producer never reviews their own artifact at a gate:** a fresh-context AI Adversary is always available and strictly preferable to self-review, so self-review is not a rung on this ladder. (The Builder's Phase 3d self-review is a pre-flight check, explicitly *not* a gate.) Whichever applies, the pass record names who reviewed and what their prior involvement was — independence is disclosed, not assumed.

**Artifact Locking:** Once the Adversary issues a pass declaration for a phase artifact, that artifact is locked — no back-edits. If subsequent work reveals a gap in a locked artifact, it is captured in a dated addendum file, not by revising the original. This preserves the audit trail and prevents retroactive rationalisation of prior decisions.[^rlm] When the Feedback Loop (Phase 5) returns to an earlier phase, the revised artifact is a new, versioned iteration — or a dated addendum — that re-enters its gate for fresh review. The lock forbids *silent* back-edits, not principled revision under re-review; every version carries its own committed pass record. Locking is scoped to the artifact kind: documents and specs are superseded by dated addenda or versions, never silently rewritten; code changes through new commits that re-enter Gate 4, never by amending the already-reviewed commit. In both cases the prior reviewed state and its pass record remain in history.

---

#### **Phase 5 — Feedback Integration Loop**

The Adversary's critique feeds back through the entire pipeline:

- **Requirements-level flaws** → Return to Phase 1. Refine the SRS, re-review at Gate 1.
- **Spec-level flaws** → Return to Phase 2. Update the spec, re-review at Gate 2.
- **Test-level flaws** → Return to Phase 3a. Fix or add tests, verify they fail against the current implementation (or a deliberately broken version), then fix implementation if needed.
- **Implementation-level flaws** → Return to Phase 3b. Re-implement minimally, then refactor (3c); ensure all tests still pass.
- **New edge cases discovered** → Add to the spec's Edge Case Catalog as a versioned addendum that re-enters Gate 2 (and Gate 1, if it introduces a new requirement); then write new failing tests that re-enter Gate 3 before implementation. Per Artifact Locking and Derivation Fidelity, a new edge case does not skip the gates that govern its artifacts.

This loop continues until convergence (see Phase 7).

**Loop Termination Signal — Architectural Escalation:** A *cycle* is one return-and-re-review of a given work item or requirement through the feedback loop. If the loop cycles three times on the same work item (same ITEM-NNN) or the same requirement (same REQ-NNN / SEC-NNN) — three successive review attempts (FAIL records) each returning a finding that resolves to that same item or requirement, whether or not the specific line moves — the issue is architectural, not implementational. Three failed fix attempts without convergence is the signal to *stop fixing* and escalate to the Architect: the spec or architecture is wrong, not the implementation. The Architect then decides whether to revise the spec, revise the architecture, or consciously accept a known limitation — except that a CSDD MUST-security violation (§A.1) and an undischarged Prove-classified property (§A.3) cannot be accepted as converged; accepting those records non-convergence, not a pass. Attempting a fourth fix without this escalation is almost always slower than surfacing the architectural problem directly — and the fix is nearly always wrong.

---

#### **Phase 6 — Formal Hardening (Executing the Verification Plan)**

The verification architecture designed in Phase 2b is now *executed* against the battle-tested implementation. Because the codebase was architected from the start with a pure core and clear purity boundaries, formal verification tools can operate on it without heroic refactoring.

- **Proof Execution:** The property specifications drafted in Phase 2b (Kani harnesses, Dafny contracts, TLA+ invariants, etc.) are run against the implementation. Because the architecture was designed for verifiability, these proofs should engage cleanly with the pure core. Failures here indicate either implementation bugs or spec properties that need refinement — both feed back through Phase 5.
- **Fuzz Testing:** Structured fuzzing (AFL++, libFuzzer, cargo-fuzz) is layered on top of property-based tests to find inputs that no human or AI anticipated. The deterministic core is an ideal fuzz target because it has no environmental dependencies to mock. The campaign's budget, corpus, sanitizers, and crash-triage rule follow **Appendix A §A.4**.
- **Security Hardening:** Static-analysis and cryptographic-edge-case suites (e.g. **Semgrep**, **Wycheproof**) are run as CI/CD gates. The required tools, their pass thresholds, finding disposition, and which work items they apply to are set in the Constitution's Security-Criticality section (§A.2); the named tools are illustrative, not normative. These are the *deeper* hardening suites: the code-quality and security analyzers Gate 4 already ran on the diff are not rerun here — Gate 5 consumes Gate 4's committed analysis evidence and adds only what Gate 4 did not cover (crypto edge cases, whole-program scans). Each required analyzer is owned by exactly one gate.
- **Mutation Testing:** Tools like **mutmut** or **Stryker** mutate the code to verify the test suite actually catches real bugs. Every surviving mutant is a signal: it is either killed by a new or strengthened test, or committed with a written justification that it is an equivalent mutant no test can kill. No surviving mutant is left unreviewed.
- **Purity Boundary Audit:** A final check that the purity boundaries defined in Phase 2b have been respected throughout implementation. Any side effects that crept into the pure core during development are flagged and refactored out.
- **Manual-Acceptance Execution:** Every `environment-visible` and `person-confirmed` scenario whose Gate 3 record is still `planned` is now executed against the hardened build and its manual-acceptance evidence record (§A.10) moved to `executed`. Convergence requires `executed`, not merely planned — a scenario confirmed only on paper has not been confirmed.

All formal verification and fuzzing results feed back into Phase 5 if issues are found. Phase 6 checks are CI gates — formal proofs, fuzz results, every mutation survivor triaged (killed or justified as equivalent), and purity boundary audit outcomes must all pass as structural prerequisites before Phase 7 convergence can be declared. These are hook-enforced, not self-certified (Core Principle 8). This is **Gate 5 — Verification** (formal proofs, fuzzing, mutation testing, security hardening, and the purity-boundary audit) — predominantly deterministic tooling, with two recorded manual exceptions (below). Its core adversary is deterministic: the prover, fuzzer, and mutation-tester are maximally-hostile reviewers that cannot be flattered or fatigued. Formal verification *is* adversarial review executed by tooling — the point where Principle 8 (external enforcement) and Principle 9 (derivation fidelity) become the same act. Two parts of Gate 5 require human judgment rather than pure tooling — the equivalent-mutant justification (mutation testing) and the purity-boundary audit's conclusions — and these follow the Principle 8 manual-exception rule: committed, Architect-signed evidence, not self-certification. The remainder (proof discharge, fuzz crash-freedom, mutant kills) is deterministic tool output. The gate passes only when every Phase 2b property has a successful proof result or a permitted bounded-concurrency result; an undischarged Prove property blocks the gate (it is non-convergence, §A.3), never a passing result.

---

#### **Phase 7 — Convergence (The Exit Signal)**

Convergence is declared **per dimension by committed evidence**, never by a reviewer's sense that an artifact is "done." A dimension has converged when its gate carries a committed pass record (schema in **Appendix A §A.7**) and **every finding it produced — whether raised by an adversary or by tooling (static analysis, fuzzer, mutation tester) — has been either resolved-and-applied or given an explicit, committed Architect sign-off**, each captured in a finding/disposition record (**Appendix A §A.8**) — either *accept-with-rationale*, or *defer as a tracked follow-up with a recorded accept-the-risk decision* (the Architect consciously accepts shipping with the item open; a bare deferral that does not name the accepted risk is not a disposition). Nothing proceeds past a gate on an un-signed-off finding, **at any severity** — there is no severity cutoff that lets a defect through unexamined. Severity orders the work and informs the Architect's decision; it never substitutes for it.

**Two classes are exempt from sign-off:** a CSDD MUST-level security violation (Appendix A §A.1), and an undischarged Prove-classified property (§A.3). Neither can be signed off, deferred, or shipped as converged — the MUST violation is fixed or compliance-verified by an alternative the reviewer confirms satisfies the clause; the Prove property is proven, or re-architected until provable (an undischarged Prove property is honest non-convergence, never a waiver). The Architect's disposition authority covers every finding *except* these two classes; for everything else — including SHOULD-level security clauses, analyzer findings, and dependency CVEs — an explicit committed sign-off is a valid disposition. (A MAY-level clause produces an advisory note, not a finding, and needs no disposition — §A.1.)

The disposition policy, the fuzz budget, and the coverage floor referenced below are fixed in the Constitution.

| Dimension | Convergence criterion (objective, committed) |
| --- | --- |
| **Requirements (SRS)** | Gate 1 pass record committed; every finding dispositioned — fixed or carrying a committed Architect sign-off; none left open. |
| **Spec** | Gate 2 pass record committed; every finding dispositioned — fixed or carrying a committed Architect sign-off; none left open. |
| **Tests** | Gate 3 pass record committed; every finding dispositioned, none left open; every behavioural-contract item and every `automated` Gherkin scenario maps to an executable test, while `environment-visible` and `person-confirmed` scenarios map to a manual-acceptance evidence record (§A.10) that is `executed` (not merely planned) by Phase 6 (mutation-survivor triage converges under Verification, since it requires implemented code). |
| **Implementation** | Gate 4 pass record committed (both passes dispositioned, §A.7); every adversary finding dispositioned; static analysis run, and every analyzer finding either fixed or carrying an explicit committed Architect sign-off (no severity auto-pass); test coverage meets the Constitution's coverage floor. |
| **Verification** | Gate 5: every finding dispositioned, none left open; every Phase 2b property has a successful proof result or a permitted bounded-concurrency result (an undischarged Prove property is recorded as explicit non-convergence that blocks Zero-Slop, never a passing result); the fuzz campaign ran to its agreed budget with no open crash; security-hardening checks pass at their Constitution thresholds; every mutation survivor killed or justified as equivalent; purity-boundary audit clean. |
| **Edit minimality** | Verified at Gate 4 Pass 2 (over-editing review): diff scope matches the work-item scope by the Step 3b diff-scope rules, any refactor sits in a separately-scoped commit, and the Adversary's minimality verdict is recorded in the Gate 4 pass record. |

**Maximum Viable Refinement** is reached when every dimension has converged. The software meets the **Zero-Slop** bar — the convergence table above with every row green — meaning every line of *production behaviour* traces to an SRS requirement (REQ-NNN, or SEC-NNN) through its spec contract, is covered by an executable test or an executed manual-acceptance evidence record (§A.10), and has survived adversarial scrutiny, with every §A.3 Prove-classified property formally proven (or a permitted bounded-concurrency result recorded). Supporting code that Phase 3 exempts — proof harnesses, build/config/infra scaffolding, governance code — traces instead to the Constitution or the verification artifact it serves, not to a REQ-NNN.

**Convergence requires evidence, not declaration.** Convergence is a deterministic roll-up, not a fresh adversarial review — the adversarial reviews are Gates 1–5. It is declared by committing a **convergence record** (a roll-up, §A.7) that cites the five gate pass records and every finding's disposition record, asserting that all are committed and none is left open. The *"Forced to manufacture flaws"* declaration is a property of a clean adversarial gate pass (`PASS_CLEAN`, §A.7), not of convergence — convergence itself carries no adversarial verdict, only the roll-up assertion. A convergence claim unaccompanied by the roll-up record is an assertion without evidence and does not satisfy Principle 11.

---

### **IV. The VSDD Contract Chain**

One of VSDD's defining properties is **full traceability**. Every artifact links back:

```
Intent → Deliberation → SRS (Clarified Requirements, REQ-NNN)
  ↓ [Gate 1: Adversary — SRS vs Intent]
Spec / SDD: Constitution + Behavioural Contract → Verification Property
  ↓ [Gate 2: Adversary — Spec vs SRS]
Work Item → Test Case
  ↓ [Gate 3: Adversary — Tests vs Spec]
Implementation
  ↓ [Gate 4: Adversary — Implementation vs Spec + Tests]
Formal Proof  (Prove-classified properties only; §A.3)
  ↓ [Gate 5: Verifier (predominantly deterministic) — Proofs, fuzz & mutation vs Spec invariants]
```

At any point, you can ask: *"Why does this line of code exist?"* and trace it all the way back to a specific spec requirement, through the verification property it satisfies, the test that demanded it, the adversarial review that hardened it, and — for the critical-path properties classified Prove (§A.3) — the formal proof that guarantees it. Code outside those property classes terminates the chain at test coverage and adversarial review; not every line ends in a proof. Equally, you can ask *"Why is this module structured as a pure function?"* and trace that decision back to the Purity Boundary Map in Phase 2b. Deliberation appears in the chain only as the *origin* of the SRS, not as a reviewed artifact: the deliberation record is human evidence, never an Adversary input (Phase 1), and no gate ever requires tracing back through it — Gate 1 reviews the SRS against the original Intent, not against the deliberation.

**Repo as Source of Truth:** Phase artifacts — the spec, the verification strategy, ADRs, the gate pass records, finding/disposition records, and the convergence roll-up record — live in the repository as versioned documents, not in conversation history or prompt memory. Prompts and conversational turns are lightweight commands; the authoritative state is always what is committed. This means every artifact can be read, diffed, and audited independently of any AI session, and a new session can be fully oriented by reading the repo alone.[^rlm]

---

### **V. Core Principles of VSDD**

1. **Spec Supremacy:** Two spec-level artifacts govern the pipeline. The **Constitution** is the project-level governing document — standing principles, architectural rules, and quality goals that apply across all features. The **Spec** is the per-feature behavioural contract — preconditions, postconditions, invariants, and edge cases for the current unit of work. Tests serve the Spec. The Spec serves the Constitution. Code serves the tests. Nothing exists without a reason traced to the Spec, and no Spec requirement may contradict the Constitution.[^speckit]

2. **Verification-First Architecture:** The need for formal provability shapes the design, not the other way around. Pure core, effectful shell. If a property that must be proven (§A.3) can't be — because effects are woven through what should be the pure core — you architected it wrong, and you find that out in Phase 2, not Phase 6.

3. **Red Before Green:** No implementation code is written until a failing test demands it. AI models are explicitly constrained to follow TDD discipline — no "let me just write the whole thing and add tests after." This governs all production behaviour — new and touched code alike. A *behaviour-preserving* refactor needs no new failing test: the existing green suite is its safety net (Phase 3c). A *behaviour-changing* edit — even one dressed as a refactor — requires a failing test that demanded it. The single exemption is code with **no forceable red state**: a stub, boilerplate, or platform-mandated scaffold (e.g. an Apex test class required only for coverage, an empty interface implementation, a constants class) that has nothing falsifiable to fail on. There the Builder commits a one-line **no-red justification** — *why* no failing state can exist — exactly as an equivalent mutant is justified, and the Adversary verifies at Gate 3/4 that the exemption is genuine, not an evasion. The exemption is disclosed and auditable, never a silent skip. (Proof harnesses and build/config/infra scaffolding are verification and scaffolding artifacts, governed by Gate 5 and the Constitution respectively — not Phase 3 behaviour code.) Genuinely non-automatable behaviour (an `environment-visible` or `person-confirmed` scenario, §A.10) is a further exception: its red-equivalent is the §A.10 record in `planned` (unconfirmed) state before implementation, transitioning to `executed` (confirmed) after — `planned`→`executed` mirrors red→green, Gate 3 confirms the planned record exists, and Phase 6 requires execution.

4. **Anti-Slop Bias:** The first "correct" version is assumed to contain hidden debt. Trust is earned through adversarial survival, not initial appearance.

5. **Forced Negativity:** Adversarial pressure bypasses the politeness filters of standard LLM interactions. The Adversary doesn't care about your feelings — it cares about your invariants.

6. **Traceability:** The Tracker ensures every spec item, test, and line of code has a corresponding tracked work item. Nothing slips through the cracks.

7. **Entropy Resistance:** The Adversary must have no prior relationship with the artifact under review — no involvement in producing it, no knowledge of the reasoning behind it, no accumulated goodwill toward its author. What persists between gate passes is the artifact itself, not the history of producing it. For AI actors, independence is implemented by resetting context on every adversarial pass. For human actors, it is implemented by assigning reviewers who had no role in producing the artifact — someone who was not in the room when the spec was written or the code was designed. The mechanism differs; the principle is the same in both cases: reviewer independence is structural, not motivational. A reviewer cannot simply decide to be impartial after being involved in production; independence must be arranged, not requested.

8. **External Enforcement over Persuasion:** Phase gates must be enforced by deterministic, non-AI scripts wherever possible — exit-code CI checks, pre-commit hooks, test runners — not by asking the Builder or Adversary to self-certify. AI confirmation of AI output is not a gate; a process that exits `1` on failure is. Prompts and instructions constrain agent behaviour at the soft level; tooling enforces it at the hard level. Where possible, validation at each phase gate should be zero-token: deterministic scripts, not LLM review.[^codeleash] Decision rule: a gate that *can* be reduced to a deterministic check MUST be automated; a gate that genuinely cannot (human design judgment) is permitted manual, but only with committed evidence — the cited command, the attached output, or the signed pass record. "Hard to automate" is not "exempt from evidence." Each gate's pass record (§A.7) lists either the automated checks that enforce it or a committed, Architect-signed rationale for why a check must stay manual; the absence of one or the other is itself a gate failure the convergence roll-up flags. Criteria like an SRS being *complete against unstated needs*, or a spec being *airtight*, are the paradigm of the genuinely-non-automatable: each decomposes into mechanizable sub-checks that carry evidence (EARS-conformance lint, contradiction scan, stakeholder-coverage list) plus an irreducible adversarial judgment — and that judgment is the very reason the gate has an Adversary rather than a script. It is recorded with rationale in the pass record, never claimed as mechanical and never eliminated.

9. **Derivation Fidelity:** Every artifact derived from another artifact has a dedicated gate review — an adversarial check of how faithfully and completely the derived artifact captures its source. The gate chain: Intent → SRS (**Gate 1**, Phase 1 Step 1b), SRS → Spec (**Gate 2**, Phase 2 Step 2c), Spec → Tests (**Gate 3**, Phase 3 — reviewed before implementation exists), Spec + Tests → Implementation (**Gate 4**, Phase 4 Pass 1 — Pass 2 is Gate 4's quality half), Spec invariants → Formal Proofs & verification (**Gate 5**, Phase 6 — proofs, fuzz, mutation, hardening, purity; predominantly deterministic). At Gates 1–4 the Adversary receives the source and derived artifacts plus the objective gate evidence its verdict needs — no deliberation records, no ADR content, no prior-review *narrative* (the objective finding and disposition records from a prior pass are admissible evidence per §A.8; only their commentary is withheld) — and its independence is its defining property. At Gate 5 the adversary is deterministic tooling (prover, fuzzer, mutation-tester): a verifier has no goodwill to accumulate, so independence holds by construction. This principle extends the pattern explicitly to the Intent→SRS transition (Gate 1) — the gate most commonly skipped because it precedes the first design decision.

10. **Full-Chain Convergence:** The system isn't done until requirements, specs, tests, implementation, *and* — for the properties classified Prove (§A.3) — formal proofs have all independently survived adversarial review. Those property classes are verified by deterministic tooling; everything else converges on test coverage plus adversarial review. An undischarged Prove property is not "done" — it ships, if at all, as a documented limitation that explicitly fails convergence (§A.3), never as a passing exception.

11. **Evidence Before Assertions:** No actor may claim a phase artifact is complete, correct, or passing without fresh verification evidence. "Tests pass" requires a test runner output, not a recollection. "Implementation is complete" requires a line-by-line spec checklist, not an impression. "The Adversary found no issues" requires a recorded Adversary pass committed to the repository, not a Builder summary. Verification that was not freshly performed is not verification — it is memory, and memory degrades. This applies to every role and every phase: the Builder who submits without running the tests; the Adversary who declares convergence without checking every item; the Architect who signs off on a spec they haven't re-read against the requirements. The structural implementation is Principle 8 (External Enforcement): wherever possible, evidence generation is automated and the output is committed alongside the artifact it verifies. Where automation is unavailable, the evidence requirement is explicit — cite the run, attach the output, commit the record.

---

### **VI. AI Orchestration Notes**

VSDD is explicitly designed for multi-model AI workflows:

- **The Builder** benefits from large context windows and strong code generation (Claude, GPT-4, etc.). It needs to hold the full spec, test suite, and implementation simultaneously.
- **The Adversary** benefits from a *different* model or configuration — and more importantly, from structurally opposed objectives. VSDD uses build vs. break role separation, not merely different model instances with different parameters. Multi-agent debate improves reasoning,[^debate] but debate between identical instances tends to converge on shared biases; genuinely opposed objectives force the disagreement that surfaces real flaws — a design hypothesis VSDD adopts, not a result the debate literature establishes.
- **The Human** is not a bottleneck — they're the strategic layer. They approve specs, resolve disputes, and make judgment calls that AI can't. The human's role is *elevated*, not diminished, by the AI orchestration.

**Session Handoff Notes (all roles):** When any work session ends — whether by context compression, explicit reset, or natural close — a handoff note is committed to the repository for the active work item: current state, decisions made this session, blockers, and the immediate next step. The note's *content* lives in the repo (Repo-as-Source-of-Truth — this is a phase artifact, not a conversation); the *active item pointer* lives in the Tracker. A fresh session reads the handoff note from the repo before touching any code or spec. This applies to every role: the Builder records implementation state; the Adversary records what converged and what remains open; the Architect records decisions made. The Tracker is not the repository for handoff note content — the repo is.[^chainlink]

**Session Logs as Fallback Artifacts:** A session log — a verbose narrative of the full session: what was done, what was decided, what was discovered, what remains open — is committed to the repository at session close as a fallback artifact. Where a structured handoff note exists, the session log is supplementary. Where a session ends abruptly (context compression, unexpected reset) without a clean handoff note, the session log is the recovery artifact — it provides the full context a structured handoff note deliberately compresses away. Stored in a consistent location within the repo (e.g., `.vsdd/sessions/YYYY-MM-DD.md`), it ensures that no session's work is irrecoverable. When an abrupt end prevents committing the log, reconstructing it is the first action of the next session (best-effort recovery, not a guarantee at the moment of failure). Minimal schema: what was done, what was decided, what was discovered, what remains open, and the active work item.

**Tracker Tooling:** The Tracker role can be fulfilled by any issue system that supports two required structural practices: (1) external enforcement of issue assignment before code edits — a hook that blocks edits without an active issue, not a prompt to remember; (2) session-survivable active-item state — a fresh session can identify the current work item without re-reading the conversation. The Tracker holds work item state (which item is active, dependencies, blockers); the repo holds artifact content (specs, TDD logs, handoff notes). Reference implementation: [Chainlink](https://github.com/dollspace-gay/chainlink) — local SQLite with Claude Code hooks. Team alternatives (GitHub Issues, Linear) require the structural practices to be implemented via hooks and issue templates.[^chainlink]

**Parallel and Distributed Execution**

When work is distributed across multiple actors — whether a team of developers or a pool of AI agents — three principles govern the decomposition. These principles apply regardless of whether the actors are human or AI; they describe how VSDD's gate structure extends to parallel work topologies.

**Spec-derived decomposition.** Work items are parallelisable if and only if the spec modules they implement are independent: no shared mutable state, no interfaces whose implementation one stream must deliver before another can proceed. The parallelism map is in the spec's dependency structure, not in the team's judgment about what is convenient to separate. If two work items have no dependency edge in the Tracker's dependency graph, they can run concurrently; if they do, they cannot. Treating parallelism as a resourcing decision rather than a spec-structure decision is the primary source of integration failures in distributed development — the coupling was always there; distributing the work just delayed the discovery.

**Bounded actor context.** Each actor in a parallel stream receives only the artifacts relevant to their assigned work item: the spec section for their module, the relevant tests, and the interface contracts for any dependencies they consume. They do not receive the full project context, the outputs or current state of sibling streams, or reasoning behind decisions made outside their scope. For AI actors, this is a context window constraint; for human actors, it is a well-scoped work item. The principle is the same: an actor with more context than their task requires will make decisions outside their assigned scope, introducing implicit coupling that the spec did not authorise and the Tracker cannot track. This extends Entropy Resistance (Core Principle 7) from the Adversary to every parallel actor.

**Integration gates.** When parallel streams rejoin, an adversarial review of the combined output against the combined spec is required before the integration is accepted. This is Gate 4 (Implementation vs. Spec + Tests) applied at the join node of the work DAG. Component-level gate passes are necessary but not sufficient: they verify that each component correctly implements its spec slice; they do not verify that the components compose correctly into the system the full spec describes. Derivation Fidelity (Core Principle 9) holds for DAG topologies — every node where artifacts are combined requires its own gate review.

**Hosted AI and Spec Confidentiality.** VSDD is designed as an AI-orchestrated workflow — but the early VSDD artifacts (the SRS, Constitution, Spec, and Verification Architecture) are typically the most information-dense documents in any project. They encode business logic, architectural constraints, quality goals, edge cases, and security posture in structured, machine-readable form. Pasting them into a hosted AI service externalises that structure in ways that may not be intended, and the pattern compounds: workflow logic, requirement categories, and architectural decisions can reveal sensitive methodology even when framed as a coding request.[^dekens]

This is an obvious caution — but it deserves explicit treatment precisely because VSDD is AI-first and the temptation to route everything through a capable hosted model is high. The mitigation is structural, not motivational:

- **Local model for the upstream phases.** Run requirements refinement and spec crystallization (Phases 1–2) against a local model (Ollama, LM Studio, or equivalent) rather than a hosted service. The Builder produces the SRS, Constitution, Spec, and Verification Architecture locally; these become committed, versioned repo artifacts. Downstream phases reference a spec already committed to the repo rather than authoring it in a prompt — but sending that committed spec to a hosted service is *still* exposure. The reduction is in not authoring sensitive structure in prompts, not a licence to ship the spec to hosted models freely; hosted downstream use remains exposure unless covered by enterprise / self-hosted controls or redaction.
- **Manual Spec Crystallization.** Author the spec as a human-first document; use AI only for the Phase 2c adversarial review, not the generative steps 2a–2b. Slower, but the spec content never leaves the local environment in prompt form. For practitioners using a structured documentation pipeline (e.g., Daedalus[^daedalus]) that can run without AI enrichment, the non-AI execution path is the privacy-safe route: run the pipeline, commit the artifacts, then invoke AI only at the review gate. For teams with strong domain expertise, this is often the right call regardless of confidentiality — the spec should reflect the Architect's understanding, not the Builder's inference from a requirements paragraph.
- **Enterprise hosting with appropriate data handling agreements.** Where local models are insufficient for the task, a self-hosted or enterprise-tier deployment of the AI service with contractual data handling terms is the middle path.

The underlying principle is Core Principle 8 applied to data: structure the workflow so sensitive content doesn't reach hosted services in prompt form in the first place, rather than trusting that the Builder will exercise discretion about what to include.

**Prompt Engineering for TDD Discipline:** The Builder must be explicitly instructed: *"You are operating under strict TDD. Write tests FIRST. Do NOT write implementation code until I confirm all tests fail. When implementing, write the MINIMUM code to pass each test."* Without this constraint, AI models will naturally try to write implementation and tests simultaneously.

---

### **VII. When to Use VSDD**

**Ecosystem positioning:** On Piskala's three-level SDD rigor taxonomy[^piskala], VSDD sits at **L2+ (Spec-Anchored with formal hardening approaching L3)**. L2 (Spec-Anchored) means the spec is maintained through the full project lifecycle, every change requires an addendum, and full REQ→test→implementation→review traceability is enforced. VSDD adds Phase 6 formal hardening (Kani/TLA+) that pure L2 frameworks do not have, without going full L3 (Spec-as-Source, where code is generated directly from the spec and not manually edited).

**Calibration heuristic (VSDD, informed by Piskala's taxonomy[^piskala]):** Before choosing a rigor level, answer one question: *"How many times in the past year did someone ask about requirements-to-test traceability?"* Zero times — L1 (Spec-First) is sufficient. Once — move to L2 (VSDD). More than once, or if an audit is likely — L2 (VSDD) plus CSDD security clauses for the security-critical paths.

VSDD is high-ceremony by design. It's worth the overhead when:

- Correctness is non-negotiable (financial systems, medical software, infrastructure)
- The codebase will be maintained long-term and must resist entropy
- Multiple AI models are available and the team wants maximum quality extraction
- Security is a primary concern, not an afterthought
- The project complexity justifies formal spec work

For rapid prototyping or throwaway scripts, use the parts that make sense — TDD discipline and a quick adversarial pass can still catch a lot of slop even without the full ceremony.

---

*"VSDD doesn't just generate code — it generates code that can prove why it exists, demonstrate that it works, and survive an adversary that wants it dead."*

---

### References

[^self-refine]: Madaan, A., Tandon, N., Gupta, P., et al. (2023). Self-Refine: Iterative Refinement with Self-Feedback. *NeurIPS 2023*. arXiv:2303.17651. https://arxiv.org/abs/2303.17651

[^debate]: Du, Y., Li, S., Torralba, A., Tenenbaum, J. B., & Mordatch, I. (2023). Improving Factuality and Reasoning in Language Models through Multiagent Debate. arXiv:2305.14325. https://arxiv.org/abs/2305.14325

[^constitutional]: Bai, Y., Kadavath, S., Kundu, S., et al. (2022). Constitutional AI: Harmlessness from AI Feedback. arXiv:2212.08073. https://arxiv.org/abs/2212.08073

[^over-editing]: Nrehiew (2026). Coding Models Are Doing Too Much. https://nrehiew.github.io/blog/minimal_editing/

[^ears]: Mavin, A. (2009). EARS (Easy Approach to Requirements Syntax). IEEE International Requirements Engineering Conference. Originally developed at Rolls-Royce aerospace; reduces modal ambiguity in requirement statements.

[^iso29148]: ISO/IEC/IEEE 29148:2018. *Systems and software engineering — Life cycle processes — Requirements engineering.* The international standard defining the content and structure of a Software Requirements Specification (SRS): stakeholders, business and functional requirements, non-functional/quality requirements, constraints, and traceability.

[^iso25010]: ISO/IEC 25010:2011. *Systems and software engineering — SQuaRE — System and software quality models.* Eight product-quality characteristics: functional suitability, performance efficiency, compatibility, usability, reliability, security, maintainability, portability.

[^arc42]: arc42 — an open template for software-architecture documentation (Starke & Hruschka). Section 9 holds architecture decisions (ADRs). https://arc42.org/

[^5cs]: Daw, A. (2026). *Five Categories of Human Excellence in the Age of AI*. https://adamdaw.com/writing/five-categories-of-human-excellence/

[^marri]: Marri, S. R. (2026). Constitutional Spec-Driven Development: Enforcing Security by Construction in AI-Assisted Code Generation. arXiv:2602.02584. https://arxiv.org/abs/2602.02584

[^piskala]: Piskala, D. B. (2026). Spec-Driven Development: From Code to Contract in the Age of AI Coding Assistants. Technical Report. arXiv:2602.00180. https://arxiv.org/abs/2602.00180

[^chainlink]: dollspace (2024). Chainlink: local-first AI-native issue tracker. https://github.com/dollspace-gay/chainlink

[^speckit]: GitHub (2025). Spec Kit: Spec-Driven Development toolkit. https://github.com/github/spec-kit

[^codeleash]: CodeLeash (2024). Constraint-based agentic TDD framework. https://codeleash.dev/

[^rlm]: doubleuuser (2024). RLM Workflow: Repository-centric Language Model workflow. https://skills.sh/doubleuuser/rlm-workflow/rlm-workflow

[^dekens]: Dekens, N. (2026). Vibe Coding Is Becoming an OSINT Risk. https://www.dutchosintguy.com/post/vibe-coding-is-becoming-an-osint-risk

[^openssf]: Open Source Security Foundation (OpenSSF). Scorecard: Security health metrics for open source projects. https://securityscorecards.dev/

[^daedalus]: Daw, A. (2026). Daedalus: Architecture documentation pipeline. https://github.com/adamdaw/daedalus

[^superpowers]: Vincent, J. (obra) (2025). Superpowers: AI pair programming skills for Claude Code. https://github.com/obra/superpowers — brainstorming skill implements the Socratic deliberation interaction model referenced in Phase 1 (Requirements Refinement).