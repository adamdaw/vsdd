# **Verified Spec-Driven Development (VSDD)**

## **The Fusion: VDD × TDD × SDD for AI-Native Engineering**

### **Overview**

**Verified Spec-Driven Development (VSDD)** is a unified software engineering methodology that fuses three proven paradigms into a single AI-orchestrated pipeline:

- **Spec-Driven Development (SDD):** Define the contract before writing a single line of implementation. Specs are the source of truth.
- **Test-Driven Development (TDD):** Tests are written *before* code. Red → Green → Refactor. No code exists without a failing test that demanded it.
- **Verification-Driven Development (VDD):** Subject all surviving code to adversarial refinement until a hyper-critical reviewer is forced to hallucinate flaws.

VSDD treats these not as competing philosophies but as **sequential gates** in a single pipeline.[^merrill] Specs define *what*. Tests enforce *how*. Adversarial verification ensures *nothing was missed*. AI models orchestrate every phase, with the human developer serving as the strategic decision-maker and final authority.

VSDD is **actor-agnostic**: every role in the pipeline — Builder, Adversary, Tracker — can be fulfilled by a human, an AI agent, or a combination of both. Where the document references AI models, this describes the most common implementation; the principles hold equally for human practitioners. A team working VSDD with no AI involvement would apply the same gates, the same traceability requirements, and the same adversarial independence constraints. The AI layer accelerates execution. The structure is independent of who executes it.

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

Each VSDD agent role is defined through the five dimensions that govern effective AI collaboration: **Constraints, Context, Curation, Conceptualization, Creativity** — a framework developed in *[Five Categories of Human Excellence in the Age of AI](https://adamdaw.com/writing/five-categories-of-human-excellence/)* (Daw, 2026). The 5Cs were originally articulated as the surfaces where human judgment concentrates in human-AI collaboration; their application here to agent role definition demonstrates that they function as a general design language, not only a practice checklist.

#### The Architect *(human developer)*

**Constraints**
Final authority in the pipeline. Cannot delegate: scope decisions, quality goal definitions, ADR approval, or the convergence declaration. Bound by real-world constraints (regulatory, budget, team capacity). Must never accept a passing adversarial review as a substitute for their own judgment.

**Context**
Needs: business requirements, stakeholder expectations, and the converged spec. Does *not* need implementation details or intermediate builder outputs — only final artifacts. Fresh context for each major decision prevents anchoring bias.

**Curation**
Selects which Adversary findings require spec revision versus which are acceptable risks to carry. Filters builder escalations: answers only what genuinely requires human judgment; delegates the rest back.

**Conceptualization**
Frames the problem as: *"What must be provably true about this system for it to be worth building?"* Thinks in quality goals, not implementation choices. Holds the tension between ideal and achievable.

**Creativity**
The only creativity in the pipeline that shapes the outcome. Generates the problem framing, the quality goals, and the decision to accept or reject convergence. The Architect's judgment is the irreducible human contribution.

---

#### The Builder *(Claude or equivalent AI)*

**Constraints**
Scope-bound to the spec — implements only what the spec authorises. Cannot make architectural decisions; surfaces ambiguities to the Architect rather than resolving them unilaterally. No implementation code without a prior failing test. No commits to main; all work on branches with a PR required — enforced by branch protection rules and a pre-push hook that rejects direct pushes to main (Core Principle 8). Output authority is limited to: implementation, tests, and documentation updates.

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
No prior relationship with the artifact — fresh context on every invocation, no accumulated goodwill. Cannot pass what doesn't meet the standard; "mostly good" is not a pass. Output format is non-negotiable: `[Location — Topic]: <concrete flaw> → <proposed correction>`. No preamble, no praise, no softening — the first word is the first flaw. If genuinely no flaws exist: exactly *"Forced to manufacture flaws. Document meets standard."* — nothing more. **Standing gate:** invoked on every PR before merge, not only at spec completion. Cannot approve its own prior suggestions — each review is independent.

**Context**
Receives the artifact under review (spec, PR diff, or codebase section) — nothing else. Does *not* receive: the history of prior reviews, the Builder's intent, the Architect's reasoning, or any framing that might soften the critique. The absence of prior context is a feature: it simulates the hostile reader, the future maintainer with no institutional memory, and the production incident investigator.

**Curation**
Scans for: completeness gaps, measurability failures, internal contradictions, invisible assumptions, and failure path omissions. For PRs specifically: documentation currency, test coverage, traceability (does this change trace to a spec requirement?), process property adherence (branch used, CI green, docs updated), and **over-editing** — changes that exceed the scope of the fix. Does *not* curate for style preferences or non-falsifiable opinions.

*Over-editing defined:* a change over-edits when it modifies code beyond what the fix strictly requires — renaming variables, adding validation, restructuring logic, introducing new nesting or control flow. Every line changed that was not broken is an unrequested change and a review burden. The Adversary flags it with: `[Location]: change exceeds fix scope → revert unrequested modifications`[^over-editing].

**Conceptualization**
Frames every review as: *"What would break, be misunderstood, or be unprovable about this artifact in the hands of someone with no context?"* Represents the hostile auditor and the future maintainer simultaneously.

**Creativity**
Tightly constrained by design. The closest analogue is the ability to surface non-obvious failure modes — two correct-looking pieces whose interaction produces an incorrect whole. Generating *"Forced to manufacture flaws"* honestly is the hardest output: it requires genuine judgment that the standard has been met, not that review fatigue has set in.

---

#### The Tracker *(AI agent or issue system)*

**Constraints**
Cannot invent requirements — every work item traces to a spec requirement. Cannot approve implementation; that is the Adversary's gate. Scope is issue decomposition and traceability only; no architectural judgment. Must maintain the full chain: Spec Requirement → Quality Scenario → Work Item → Test Case → Implementation. In team contexts, integrates with whatever issue tracking system the team uses — does not replace it.

Must enforce issue assignment before code edits — no implementation work begins without an active, assigned work item. This is an External Enforcement concern: the mechanism should be structural (a hook that blocks edits without an active issue) rather than instructional. A prompt to "always create an issue first" is not enforcement; a pre-edit hook that exits `1` without an active issue is.[^chainlink]

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

#### **Phase 1 — Requirements Refinement**

*Before the system is designed, the problem is made legible. Requirements are refined into an approved baseline — the SRS — and nothing is designed against requirements that have not survived their own gate.*

This is the requirements-refinement front-end: the disciplined analogue of a brainstorming pass.[^superpowers] It precedes all technical design. Its product is the **Software Requirements Specification (SRS)** — the business-facing statement of *what* the system must do and *why*, for stakeholders, Product, and QA. The *how* — architecture, interfaces, verification strategy — is a separate, later pass (Phase 2, the SDD). Keeping them apart is deliberate: requirements work must not stall on implementation decisions, and the build must not quietly redefine the requirement.

**Step 1 — Deliberation**

A Socratic dialog agent — or a structured deliberation session — asks questions one at a time: clarifying ambiguous intent, surfacing implicit assumptions, identifying stakeholders and their goals, exploring alternative framings, and probing "what happens if X is wrong?" for each major requirement. Resolve nothing silently. The deliberation produces two outputs, and the boundary between them is critical:

1. **The SRS (Clarified Requirements).** Every implicit assumption, alternative interpretation, and intent clarification surfaced during deliberation is written explicitly into the requirements document. This enriched document — not the original requirements stub — is the input to Phase 2 and the artifact reviewed at Gate 1. The SRS is the Architect's intent made legible.

2. **ADR entries.** Rejected alternatives, reasoning behind significant decisions, trade-offs consciously accepted. Committed to the repository (arc42 Section 9 / `Constitution.md` ADR section) as human-readable records for the Architect and future maintainers.

**What the Adversary does NOT receive:** the deliberation record or ADR content. The Adversary at every gate receives only the source artifact and the artifact derived from it — at Gate 1, the original feature request and the SRS; nothing more. This boundary is not a convenience; it is the mechanism that preserves the Adversary's independence. An Adversary that knows *why* a requirement was written the way it was will probe against the specifier's reasoning rather than independently arriving at whether the conclusion is sound. The gap between what the specifier intended and what the Adversary independently finds *is* the value of the gate. Collapsing that gap by sharing the deliberation defeats the purpose.[^superpowers]

**Mockups as elicitation.** For requirements that are easier to *see* than to describe — anything operator- or UI-facing — a low-fidelity mockup (a throwaway HTML/CSS page, a wireframe, a clickable prototype) is often the fastest way to settle intent with stakeholders. A business owner who cannot articulate a requirement in the abstract will react decisively to a concrete screen, and the disagreements surface while they are still cheap to resolve. The mockup is an **elicitation aid, not a design commitment**: what it surfaces is written back into the SRS as observable behaviour (the *what*), and the mock itself is throwaway — it does not constrain the SDD's implementation choices (the *how*), and it is not an Adversary input. Treat it like the deliberation record — a human-facing instrument for reaching agreement, discarded once that agreement is captured as requirements.

**Step 1a — Authoring the SRS (tiered to the unit of work)**

The weight of the SRS is keyed to the decomposition unit:

- **Epic-sized work** — a requirement that will fan out into multiple independently-deployable work items — gets the **full SRS**: a structured requirements document along the lines of ISO/IEC/IEEE 29148.[^iso29148] Its sections: Purpose and Scope; Stakeholders (role, goals, priority); Business Requirements (each a goal with a measurable success criterion, MoSCoW-prioritised); Functional Requirements (user stories — *As a [role], I want [capability], so that [benefit]*); Non-Functional Requirements (ISO 25010 quality categories, each with a measurable criterion); Constraints; Assumptions and Dependencies (with impact-if-wrong); Acceptance Criteria (Gherkin, per Must requirement); and a Requirements Traceability Matrix. The epic-level SRS is the artifact that *feeds the decomposition* into work items.

- **Work-item-sized work** — a single, independently-deployable unit — gets the **light SRS**: EARS-format requirements plus Gherkin acceptance criteria, grouped by how each is confirmed (automatically / visible in the environment / by a person). A work item born from an epic inherits the relevant slice of the epic SRS and adds only its specifics.

Requirements are written in **EARS format** (Easy Approach to Requirements Syntax)[^ears] — five fill-in-the-blank patterns that eliminate ambiguity by mandating SHALL/MUST and forbidding *should*, *may*, *could*, *might*:
  - *Ubiquitous:* `The system SHALL <action>.`
  - *Event-Driven:* `WHEN <trigger>, the system SHALL <action>.`
  - *State-Driven:* `WHILE <state>, the system SHALL <action>.`
  - *Optional Feature:* `WHERE <feature is included>, the system SHALL <action>.`
  - *Unwanted Behaviour:* `IF <condition>, THEN the system SHALL <response>.`
Acceptance criteria are written as **Gherkin** scenarios (*Given / When / Then*), one per meaningful path. Each requirement receives a unique identifier (REQ-NNN) that traces through the full chain: REQ-NNN → spec contract → test case → implementation → adversarial review → formal proof.

**Describe WHAT, never HOW.** A requirement states observable behaviour — inputs, outputs, system responses — that a tester could verify *without reading the code*. If you cannot verify it without opening the implementation, it is HOW, not WHAT: class hierarchies, internal patterns, framework names, and coverage thresholds are design detail and belong to the SDD (Phase 2), not the SRS. This boundary is the load-bearing seam between Phase 1 and Phase 2.

**Decomposition bridge.** When the SRS describes an epic, it is cut into atomic, independently-deployable work items before Phase 2 begins — each work item carrying its own light SRS (its slice of the epic SRS plus specifics), its dependencies named, and its criticality tagged. Decomposition is dependency-aware (the Tracker's role; see §II). A "work item" that cannot name its single responsibility or cannot deploy without a sibling is not yet atomic — split it before it enters Phase 2.

**Step 1b — SRS Review Gate (Gate 1 — SRS Fidelity Review)**

The SRS is reviewed by *both* the human and the Adversary before any technical spec is written. The Adversary receives the original feature request and the SRS — nothing else: no deliberation record, no ADR, no architectural reasoning. This is Gate 1 in the Derivation Fidelity chain (Core Principle 9), and the gate most commonly skipped because it precedes the first design decision. The Adversary checks that every requirement is:

- **Unambiguous** — EARS-shaped, no *should/may/could*; it cannot be read two ways.
- **Testable without code** — verifiable by observing behaviour, not by reading the implementation.
- **Complete** — no missing stakeholder, no unhandled edge case, no NFR left implicit (null / empty / maximum / concurrent behaviour stated where it matters).
- **Non-contradictory** — no requirement conflicts with another or with the Constitution's quality goals.
- **WHAT, not HOW** — no design or implementation detail has leaked into the requirement.

The SRS is iterated until the Adversary can find no legitimate holes. **No technical spec authorship (Phase 2) begins until Gate 1 is cleared and the Architect signs off** — the approve-before-design gate. Clearing a finding means resolved-and-applied or explicitly accepted by the Architect, not merely acknowledged. Enforce structurally: a pre-Phase-2 hook that checks for a committed Gate 1 pass record (Core Principle 8).

---

#### **Phase 2 — Spec Crystallization**

*Nothing gets built until the contract is airtight — and the architecture is verification-ready by design.*

**Prerequisite: the Constitution.** Before any feature work begins, the Architect establishes a project-level **Constitution** — the standing governing principles, architectural rules, and quality goals that all per-feature Specs must honour. The Constitution is a living document owned by the Architect; it does not change per feature. If a feature Spec would require violating the Constitution, the Architect must consciously amend the Constitution first rather than allowing silent exceptions.[^speckit]

**Dependency Hygiene Policy.** The Constitution SHOULD establish a project-wide dependency hygiene policy covering all features. Minimum viable content: (1) a *justification requirement* — any new dependency must document what it provides that existing dependencies or the standard library cannot; (2) a *pinning strategy* — direct dependencies pinned via lock file; no floating version ranges in production artifacts; (3) a *review checklist* that the Adversary applies on every PR introducing a new dependency (see Phase 4, item 7). For projects on a security-critical path, the policy MAY extend to OpenSSF Scorecard requirements or equivalent maintenance and provenance criteria.[^openssf]

With an approved SRS in hand, the Builder produces a **formal specification document** — the **Software Design Document (SDD)** — for each unit of work. This phase encodes the SRS's requirements into a technical contract for developers, architects, and reviewers: it does not merely restate *what* the software does — it defines *how* it is built and *what must be provable about it*, and structures the architecture accordingly.

**Step 2a: Behavioural Specification**

The Builder encodes the SRS's requirements into the functional contract:

- **Behavioural Contract:** What the module/function/endpoint *must* do, expressed as preconditions, postconditions, and invariants. Each EARS requirement from the SRS (REQ-NNN) is encoded here as a formal contract clause; the identifier carries through to the test case, implementation, adversarial review, and formal proof.
- **Interface Definition:** Input types, output types, error types. No ambiguity. If it's an API, this is the OpenAPI/GraphQL schema. If it's a module, this is the type signature and doc contract.
- **Edge Case Catalog:** Explicitly enumerated boundary conditions, degenerate inputs, and failure modes. The Builder is prompted to be *exhaustive* here — "What happens when the input is null? Empty? Maximum size? Negative? Unicode? Concurrent?" Edge cases already enumerated in the SRS carry their existing REQ-NNN; any edge case first surfaced here is written back into the SRS and minted a REQ-NNN there, not numbered independently in the SDD. Each traces to a dedicated test.
- **Non-Functional Requirements:** Performance bounds, memory constraints, security considerations baked into the spec itself.
- **Security Clauses (security-critical paths):** For any feature on a security-critical path (authentication, authorisation, financial calculation, data handling), the Behavioural Contract includes constitutional security clauses in CSDD format[^marri]: each clause has a SEC-NNN identifier, a CWE reference (e.g., CWE-89 SQL Injection), a MUST/SHOULD/MAY level, an implementation pattern, and an enforcement mechanism (static analysis rule, merge blocker). MUST-level violations reject the implementation and require a rewrite. This layer is optional for non-security-critical features and mandatory for those that are. Empirical basis: constitutional security constraints reduce security defects by 73% compared to unconstrained AI generation with no velocity degradation.[^marri]

**Step 2b: Verification Architecture**

Before any implementation design is finalised, the Builder produces a **Verification Strategy** that answers: *"What properties of this system must be mathematically provable, and what architectural constraints does that impose?"*

This includes:

- **Provable Properties Catalog:** Which invariants, safety properties, and correctness guarantees must be formally verified — not just tested? Examples: "This state machine can never reach an invalid state." "This arithmetic can never overflow." "This parser always terminates." "This access control check is never bypassed." The Builder distinguishes between properties that *should* be proven (critical path, security boundaries, financial calculations) and properties where test coverage is sufficient (UI formatting, logging, non-critical defaults).
- **Purity Boundary Map:** A clear architectural separation between the **deterministic, side-effect-free core** (where formal verification can operate) and the **effectful shell** (I/O, network, database, user interaction). This is the most consequential design decision in VSDD — it dictates module boundaries, dependency direction, and how state flows through the system. The pure core must be designed so that verification tools can reason about it without mocking the entire universe.
- **Verification Tooling Selection:** Based on the language and the properties to be proven, the Builder selects the appropriate formal verification stack (Kani for Rust, CBMC for C/C++, Dafny, TLA+ for distributed systems, etc.) and identifies any constraints these tools impose on code structure. This happens *now*, not after the code is written, because tool constraints are architectural constraints. Where tooling selection is uncertain, a **Research artifact** is produced first — a spike that validates the chosen tool against a representative property before the full verification architecture commits to it. The Research artifact records spike results, the tool decision, and reasons alternatives were rejected; it is committed to the repository alongside the Constitution and Spec.[^speckit]
- **Property Specifications:** Where possible, the Builder drafts the actual formal property definitions (e.g., Kani proof harnesses, Dafny contracts, TLA+ invariants) alongside the behavioural spec. These aren't implementation — they're the formal expression of what the spec already says in natural language. They serve as a second, mathematically precise encoding of the requirements.

**Why this must happen in Phase 2:** If the system is designed with side effects woven through the core logic, no amount of Phase 6 heroics will make it verifiable. A function that reads from a database, performs a calculation, and writes to a log in one block cannot be formally verified without mocking infrastructure that the verifier may not support. But a function that takes data in, returns a result, and lets the caller handle persistence — that's a function a model checker can reason about. This boundary must be drawn at the spec level because it fundamentally shapes the module decomposition, the dependency graph, and the testing strategy that follows.

**Step 2c: Spec Review Gate (Gate 2 — Spec Fidelity Review)**

The complete spec — behavioural contracts *and* verification architecture — is reviewed by *both* the human and the Adversary before any tests are written. The Adversary receives the approved SRS (Phase 1) and the Spec. It receives nothing else — no deliberation record, no ADR, no reasoning behind spec decisions. This is Gate 2 in the Derivation Fidelity chain (Core Principle 9).

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

#### **Phase 3 — Test-First Implementation (The TDD Core)**

*Red → Green → Refactor, enforced by AI.*

With an airtight spec in hand, the Builder now writes tests — and *only* tests. No implementation code yet.

**Step 3a: Test Suite Generation**

The Builder translates the spec directly into executable tests:

- **Unit Tests:** One or more tests per behavioural contract item. Every postcondition becomes an assertion. Every precondition violation becomes a test that expects a specific error.
- **Edge Case Tests:** Every item in the Edge Case Catalog becomes a test. These are the tests that catch the bugs that "never happen in production" (until they do).
- **Integration Tests:** Tests that verify the module works correctly within the larger system context defined in the spec.
- **Property-Based Tests:** Where applicable, the Builder generates property-based tests (e.g., using Hypothesis, fast-check, or proptest) that assert invariants hold across randomised inputs.

**The Red Gate:** All tests must *fail* before any implementation begins. If a test passes without implementation, the test is suspect — it's either testing the wrong thing or the spec was wrong. The Builder flags this for human review. This gate should be enforced structurally: a pre-implementation hook that verifies at least one failing test exists before allowing code edits, consistent with External Enforcement over Persuasion (Core Principle 8).

**Regression Test Verification (Red–Green–Revert cycle):** For bug fixes, the Red Gate has a stricter form. After writing the regression test: (1) confirm it *fails* on the broken code; (2) apply the fix and confirm the test *passes*; (3) *revert* the fix and confirm the test *fails* again; (4) restore the fix. A regression test that passes before the fix is applied was never testing the right thing — it cannot catch a regression. Only the three-step Red → Green → Revert → Red sequence proves the test is genuinely tied to the defect it is meant to guard against.

**Step 3b: Minimal Implementation**

The Builder writes the *minimum* code necessary to make each test pass, one at a time. This is classic TDD discipline:

1. Pick the next failing test.
2. Write the smallest implementation that makes it pass.
3. Run the full suite — nothing else should break.
4. Repeat.

**TDD Compliance Log:** The Builder records, for each requirement, the mapping: failing test → minimal implementation → test pass. This log is committed to the repository alongside the code. It is not documentation after the fact — it is the audit trail that the Adversary checks when verifying that TDD discipline was followed in practice, not merely claimed.[^rlm]

**Step 3c: Refactor**

After all tests are green, the Builder refactors for clarity, performance, and adherence to the non-functional requirements in the spec. The test suite acts as the safety net — if refactoring breaks something, the tests catch it immediately.

**Human Checkpoint:** The developer reviews the test suite and implementation for alignment with the "spirit" of the spec. AI can miss intent even when it nails the letter of the contract.

**Step 3d: Builder Self-Review**

Before handing off to the Adversary, the Builder performs a self-critique pass against the spec. This is not a replacement for adversarial review — it is a pre-flight check that surfaces issues the Builder can identify from its own position. Prompt: *"Review your implementation against the spec. Identify anything incomplete, inconsistent with the spec, or likely to fail adversarial scrutiny. Fix what you can; escalate what cannot be resolved without Architect input."* Self-review with explicit prompting yields measurable improvement before external review; the Adversary then focuses on what self-review cannot reach.[^self-refine]

---

#### **Phase 4 — Adversarial Refinement**

*The code survived testing. Now it faces the Adversary.*

The verified, test-passing codebase — along with the spec and test suite — is presented to the Adversary in a fresh context window. This is a **standing gate**: the Adversary runs on every PR before merge, not only at spec completion. The gate should be enforced structurally — a CI check or pre-merge hook that blocks merge without a recorded Adversary pass — not by relying on the Builder to remember to invoke it (Core Principle 8).

Phase 4 runs as **two sequential passes**. Pass 2 is not dispatched until Pass 1 issues a clean result. This separation keeps each reviewer's question narrow and prevents code quality findings from displacing spec compliance gaps.

**Pass 1 — Spec Compliance**

The Adversary reads the implementation directly. It does *not* take the Builder's summary of what was done at face value — the Builder's report describes intent; the code describes fact. Discrepancies between them are findings. The Adversary verifies:

1. **Spec Fidelity:** Does the implementation actually satisfy the spec, or did the tests inadvertently encode a misunderstanding? The Adversary treats the spec as a constitution: the implementation must satisfy it fully and explicitly, not approximately. There is no partial credit for "mostly implemented" or "intended to satisfy" — either the requirement is met, demonstrably, or it is not.[^constitutional]
2. **Spec Gaps Revealed by Implementation:** Sometimes writing the code reveals that the spec was incomplete. The Adversary looks for implemented behaviour that isn't covered by the spec — and for spec requirements that have no corresponding implementation the Builder failed to mention.

Pass 1 findings require a return to Phase 2 or Phase 3 before Pass 2 is run.

**Pass 2 — Code Quality** *(only after Pass 1 passes)*

3. **Test Quality:** Are the tests actually testing what they claim? Are there tests that would pass even if the implementation were subtly wrong? (Tautological tests, tests that mock too aggressively, tests that assert on implementation details rather than behaviour.)
4. **Code Quality:** Placeholder comments, generic error handling, inefficient patterns, hidden coupling, missing resource cleanup, race conditions.
5. **Security Surface:** Input validation gaps, injection vectors, authentication/authorisation assumptions.
6. **Process Properties:** For PRs — branch used, CI green, documentation updated, change traceable to a spec requirement.
7. **Dependency Surface:** For any PR that introduces a new dependency — is the addition justified by the spec? Does it respect the Constitution's dependency hygiene policy? Are there known CVEs in the current version? Is the package actively maintained, or abandoned upstream? Does the transitive graph introduce surface area the spec did not anticipate? The Adversary flags any dependency addition that lacks an explicit justification traceable to a spec requirement or that fails the Constitution's hygiene checklist. An AI-generated implementation that silently reaches for a third-party package to solve a problem the standard library could handle is an over-scoped dependency, not a Builder judgment call — flag it the same way over-editing is flagged.[^dekens]

**Negative Prompting:** The Adversary is configured for zero tolerance. No "overall this looks good, but..." preamble. Every piece of feedback is a concrete flaw with a specific location and a proposed fix or question.

**Independence Reset:** The Adversary invoked for each pass must have had no involvement in producing the artifact under review, and no involvement in the prior pass. For AI actors: fresh context window. For human actors: independent reviewer assignment — someone who was not present at prior review sessions. No relationship drift. No accumulated goodwill. (See Core Principle 7 — Entropy Resistance.)

**Artifact Locking:** Once the Adversary issues a pass declaration for a phase artifact, that artifact is locked — no back-edits. If subsequent work reveals a gap in a locked artifact, it is captured in a dated addendum file, not by revising the original. This preserves the audit trail and prevents retroactive rationalisation of prior decisions.[^rlm]

---

#### **Phase 5 — Feedback Integration Loop**

The Adversary's critique feeds back through the entire pipeline:

- **Requirements-level flaws** → Return to Phase 1. Refine the SRS, re-review at Gate 1.
- **Spec-level flaws** → Return to Phase 2. Update the spec, re-review at Gate 2.
- **Test-level flaws** → Return to Phase 3a. Fix or add tests, verify they fail against the current implementation (or a deliberately broken version), then fix implementation if needed.
- **Implementation-level flaws** → Return to Phase 3b. Re-implement minimally, then refactor (3c); ensure all tests still pass.
- **New edge cases discovered** → Add to spec's Edge Case Catalog, write new failing tests, implement fixes.

This loop continues until convergence (see Phase 7).

**Loop Termination Signal — Architectural Escalation:** If the loop cycles on the same spec requirement or component more than three times without resolution — each fix attempt spawning a new Adversary finding at the same location — the issue is architectural, not implementational. Three failed fix attempts without convergence is the signal to *stop fixing* and escalate to the Architect: the spec or architecture is wrong, not the implementation. The Architect then decides whether to revise the spec, revise the architecture, or consciously accept a known limitation. Attempting a fourth fix without this escalation is almost always slower than surfacing the architectural problem directly — and the fix is nearly always wrong.

---

#### **Phase 6 — Formal Hardening (Executing the Verification Plan)**

The verification architecture designed in Phase 2b is now *executed* against the battle-tested implementation. Because the codebase was architected from the start with a pure core and clear purity boundaries, formal verification tools can operate on it without heroic refactoring.

- **Proof Execution:** The property specifications drafted in Phase 2b (Kani harnesses, Dafny contracts, TLA+ invariants, etc.) are run against the implementation. Because the architecture was designed for verifiability, these proofs should engage cleanly with the pure core. Failures here indicate either implementation bugs or spec properties that need refinement — both feed back through Phase 5.
- **Fuzz Testing:** Structured fuzzing (AFL++, libFuzzer, cargo-fuzz) is layered on top of property-based tests to find inputs that no human or AI anticipated. The deterministic core is an ideal fuzz target because it has no environmental dependencies to mock.
- **Security Hardening:** Suites like **Wycheproof** (cryptographic edge cases) and **Semgrep** (static analysis) are run as CI/CD gates.
- **Mutation Testing:** Tools like **mutmut** or **Stryker** mutate the code to verify the test suite actually catches real bugs. If a mutation survives, the test suite has a gap.
- **Purity Boundary Audit:** A final check that the purity boundaries defined in Phase 2b have been respected throughout implementation. Any side effects that crept into the pure core during development are flagged and refactored out.

All formal verification and fuzzing results feed back into Phase 5 if issues are found. Phase 6 checks are CI gates — formal proofs, fuzz results, mutation test kill rates, and purity boundary audit outcomes must all pass as structural prerequisites before Phase 7 convergence can be declared. These are hook-enforced, not self-certified (Core Principle 8).

---

#### **Phase 7 — Convergence (The Exit Signal)**

VSDD inherits VDD's **hallucination-based termination**, extended across every layer of the derivation chain:

| Dimension | Convergence Signal |
| --- | --- |
| **Requirements (SRS)** | Gate 1 cleared with no open findings; the Adversary's SRS critiques are wording nitpicks, not missing requirements, absent stakeholders, or unhandled edge cases. |
| **Spec** | The Adversary's spec critiques are nitpicks about wording, not about missing behaviour, ambiguity, or verification gaps. |
| **Tests** | The Adversary can't identify a meaningful untested scenario. Mutation testing confirms high kill rate. |
| **Implementation** | The Adversary is forced to invent problems that don't exist in the code. |
| **Verification** | All properties from the Phase 2b catalog pass formal proof. Fuzzers find nothing. Purity boundaries are intact. |
| **Edit minimality** | No unrequested structural changes — no nesting, branching, or control flow introduced beyond what each fix required. Diff scope matches work item scope. |

**Maximum Viable Refinement** is reached when every dimension has converged. The software is considered **Zero-Slop** — every line of code traces to an SRS requirement (REQ-NNN) through its spec contract, is covered by a test, has survived adversarial scrutiny, and the critical path is formally proven.

**Convergence requires evidence, not declaration.** The Adversary's convergence pass is not complete until the pass record — including the exact artifacts reviewed, the verification commands run, and the "Forced to manufacture flaws" declaration — is committed to the repository. A convergence claim unaccompanied by this record is an assertion without evidence and does not satisfy Principle 11.

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
Formal Proof
  ↓ [Gate 5: Adversary — Proofs vs Spec invariants]
```

At any point, you can ask: *"Why does this line of code exist?"* and trace it all the way back to a specific spec requirement, through the verification property it satisfies, the test that demanded it, the adversarial review that hardened it, and the formal proof that guarantees it. Equally, you can ask *"Why is this module structured as a pure function?"* and trace that decision back to the Purity Boundary Map in Phase 2b.

**Repo as Source of Truth:** Phase artifacts — the spec, the verification strategy, ADRs, the Adversary's convergence declarations — live in the repository as versioned documents, not in conversation history or prompt memory. Prompts and conversational turns are lightweight commands; the authoritative state is always what is committed. This means every artifact can be read, diffed, and audited independently of any AI session, and a new session can be fully oriented by reading the repo alone.[^rlm]

---

### **V. Core Principles of VSDD**

1. **Spec Supremacy:** Two spec-level artifacts govern the pipeline. The **Constitution** is the project-level governing document — standing principles, architectural rules, and quality goals that apply across all features. The **Spec** is the per-feature behavioural contract — preconditions, postconditions, invariants, and edge cases for the current unit of work. Tests serve the Spec. The Spec serves the Constitution. Code serves the tests. Nothing exists without a reason traced to the Spec, and no Spec requirement may contradict the Constitution.[^speckit]

2. **Verification-First Architecture:** The need for formal provability shapes the design, not the other way around. Pure core, effectful shell. If you can't verify it, you architected it wrong — and you find that out in Phase 2, not Phase 6.

3. **Red Before Green:** No implementation code is written until a failing test demands it. AI models are explicitly constrained to follow TDD discipline — no "let me just write the whole thing and add tests after."

4. **Anti-Slop Bias:** The first "correct" version is assumed to contain hidden debt. Trust is earned through adversarial survival, not initial appearance.

5. **Forced Negativity:** Adversarial pressure bypasses the politeness filters of standard LLM interactions. The Adversary doesn't care about your feelings — it cares about your invariants.

6. **Traceability:** The Tracker ensures every spec item, test, and line of code has a corresponding tracked work item. Nothing slips through the cracks.

7. **Entropy Resistance:** The Adversary must have no prior relationship with the artifact under review — no involvement in producing it, no knowledge of the reasoning behind it, no accumulated goodwill toward its author. What persists between gate passes is the artifact itself, not the history of producing it. For AI actors, independence is implemented by resetting context on every adversarial pass. For human actors, it is implemented by assigning reviewers who had no role in producing the artifact — someone who was not in the room when the spec was written or the code was designed. The mechanism differs; the principle is the same in both cases: reviewer independence is structural, not motivational. A reviewer cannot simply decide to be impartial after being involved in production; independence must be arranged, not requested.[^reflexion]

8. **External Enforcement over Persuasion:** Phase gates must be enforced by deterministic, non-AI scripts wherever possible — exit-code CI checks, pre-commit hooks, test runners — not by asking the Builder or Adversary to self-certify. AI confirmation of AI output is not a gate; a process that exits `1` on failure is. Prompts and instructions constrain agent behaviour at the soft level; tooling enforces it at the hard level. Where possible, validation at each phase gate should be zero-token: deterministic scripts, not LLM review.[^codeleash]

9. **Derivation Fidelity:** Every artifact derived from another artifact has a dedicated gate review — an adversarial check of how faithfully and completely the derived artifact captures its source. The gate chain: Intent → SRS (**Gate 1**, Phase 1 Step 1b), SRS → Spec (**Gate 2**, Phase 2 Step 2c), Spec → Tests (**Gate 3**, Phase 4 Pass 2), Spec + Tests → Implementation (**Gate 4**, Phase 4 Pass 1), Spec invariants → Formal Proofs (**Gate 5**, Phase 6). At every gate, the Adversary receives only the source and derived artifacts — no deliberation records, no ADR content, no prior review history. The Adversary's independence at every gate is its defining property. This principle extends the pattern explicitly to the Intent→SRS transition (Gate 1) — the gate most commonly skipped because it precedes the first design decision.

10. **Full-Chain Convergence:** The system isn't done until requirements, specs, tests, implementation, *and* formal proofs have all independently survived adversarial review.

11. **Evidence Before Assertions:** No actor may claim a phase artifact is complete, correct, or passing without fresh verification evidence. "Tests pass" requires a test runner output, not a recollection. "Implementation is complete" requires a line-by-line spec checklist, not an impression. "The Adversary found no issues" requires a recorded Adversary pass committed to the repository, not a Builder summary. Verification that was not freshly performed is not verification — it is memory, and memory degrades. This applies to every role and every phase: the Builder who submits without running the tests; the Adversary who declares convergence without checking every item; the Architect who signs off on a spec they haven't re-read against the requirements. The structural implementation is Principle 8 (External Enforcement): wherever possible, evidence generation is automated and the output is committed alongside the artifact it verifies. Where automation is unavailable, the evidence requirement is explicit — cite the run, attach the output, commit the record.

---

### **VI. AI Orchestration Notes**

VSDD is explicitly designed for multi-model AI workflows:

- **The Builder** benefits from large context windows and strong code generation (Claude, GPT-4, etc.). It needs to hold the full spec, test suite, and implementation simultaneously.
- **The Adversary** benefits from a *different* model or configuration — and more importantly, from structurally opposed objectives. VSDD uses build vs. break role separation, not merely different model instances with different parameters. Multi-agent debate between identical instances still converges on shared biases; genuinely opposed objectives force the disagreement that surfaces real flaws.[^debate]
- **The Human** is not a bottleneck — they're the strategic layer. They approve specs, resolve disputes, and make judgment calls that AI can't. The human's role is *elevated*, not diminished, by the AI orchestration.

**Session Handoff Notes (all roles):** When any work session ends — whether by context compression, explicit reset, or natural close — a handoff note is committed to the repository for the active work item: current state, decisions made this session, blockers, and the immediate next step. The note's *content* lives in the repo (Repo-as-Source-of-Truth — this is a phase artifact, not a conversation); the *active item pointer* lives in the Tracker. A fresh session reads the handoff note from the repo before touching any code or spec. This applies to every role: the Builder records implementation state; the Adversary records what converged and what remains open; the Architect records decisions made. The Tracker is not the repository for handoff note content — the repo is.[^chainlink]

**Session Logs as Fallback Artifacts:** A session log — a verbose narrative of the full session: what was done, what was decided, what was discovered, what remains open — is committed to the repository at session close as a fallback artifact. Where a structured handoff note exists, the session log is supplementary. Where a session ends abruptly (context compression, unexpected reset) without a clean handoff note, the session log is the recovery artifact — it provides the full context a structured handoff note deliberately compresses away. Stored in a consistent location within the repo (e.g., `.vsdd/sessions/YYYY-MM-DD.md`), it ensures that no session's work is irrecoverable.

**Tracker Tooling:** The Tracker role can be fulfilled by any issue system that supports two required structural practices: (1) external enforcement of issue assignment before code edits — a hook that blocks edits without an active issue, not a prompt to remember; (2) session-survivable active-item state — a fresh session can identify the current work item without re-reading the conversation. The Tracker holds work item state (which item is active, dependencies, blockers); the repo holds artifact content (specs, TDD logs, handoff notes). Reference implementation: [Chainlink](https://github.com/dollspace-gay/chainlink) — local SQLite with Claude Code hooks. Team alternatives (GitHub Issues, Linear) require the structural practices to be implemented via hooks and issue templates.[^chainlink]

**Parallel and Distributed Execution**

When work is distributed across multiple actors — whether a team of developers or a pool of AI agents — three principles govern the decomposition. These principles apply regardless of whether the actors are human or AI; they describe how VSDD's gate structure extends to parallel work topologies.

**Spec-derived decomposition.** Work items are parallelisable if and only if the spec modules they implement are independent: no shared mutable state, no interfaces whose implementation one stream must deliver before another can proceed. The parallelism map is in the spec's dependency structure, not in the team's judgment about what is convenient to separate. If two work items have no dependency edge in the Tracker's dependency graph, they can run concurrently; if they do, they cannot. Treating parallelism as a resourcing decision rather than a spec-structure decision is the primary source of integration failures in distributed development — the coupling was always there; distributing the work just delayed the discovery.

**Bounded actor context.** Each actor in a parallel stream receives only the artifacts relevant to their assigned work item: the spec section for their module, the relevant tests, and the interface contracts for any dependencies they consume. They do not receive the full project context, the outputs or current state of sibling streams, or reasoning behind decisions made outside their scope. For AI actors, this is a context window constraint; for human actors, it is a well-scoped work item. The principle is the same: an actor with more context than their task requires will make decisions outside their assigned scope, introducing implicit coupling that the spec did not authorise and the Tracker cannot track. This extends Entropy Resistance (Core Principle 7) from the Adversary to every parallel actor.

**Integration gates.** When parallel streams rejoin, an adversarial review of the combined output against the combined spec is required before the integration is accepted. This is Gate 4 (Implementation vs. Spec + Tests) applied at the join node of the work DAG. Component-level gate passes are necessary but not sufficient: they verify that each component correctly implements its spec slice; they do not verify that the components compose correctly into the system the full spec describes. Derivation Fidelity (Core Principle 9) holds for DAG topologies — every node where artifacts are combined requires its own gate review.

**Hosted AI and Spec Confidentiality.** VSDD is designed as an AI-orchestrated workflow — but the early VSDD artifacts (the SRS, Constitution, Spec, and Verification Architecture) are typically the most information-dense documents in any project. They encode business logic, architectural constraints, quality goals, edge cases, and security posture in structured, machine-readable form. Pasting them into a hosted AI service externalises that structure in ways that may not be intended, and the pattern compounds: workflow logic, requirement categories, and architectural decisions can reveal sensitive methodology even when framed as a coding request.[^dekens]

This is an obvious caution — but it deserves explicit treatment precisely because VSDD is AI-first and the temptation to route everything through a capable hosted model is high. The mitigation is structural, not motivational:

- **Local model for the upstream phases.** Run requirements refinement and spec crystallization (Phases 1–2) against a local model (Ollama, LM Studio, or equivalent) rather than a hosted service. The Builder produces the SRS, Constitution, Spec, and Verification Architecture locally; these become committed, versioned repo artifacts. Downstream phases — where the sensitive spec is already in the repo rather than in a prompt — can use hosted models without additional exposure.
- **Manual Spec Crystallization.** Author the spec as a human-first document; use AI only for the Phase 2c adversarial review, not the generative steps 2a–2b. Slower, but the spec content never leaves the local environment in prompt form. For practitioners using a structured documentation pipeline (e.g., Daedalus[^daedalus]) that can run without AI enrichment, the non-AI execution path is the privacy-safe route: run the pipeline, commit the artifacts, then invoke AI only at the review gate. For teams with strong domain expertise, this is often the right call regardless of confidentiality — the spec should reflect the Architect's understanding, not the Builder's inference from a requirements paragraph.
- **Enterprise hosting with appropriate data handling agreements.** Where local models are insufficient for the task, a self-hosted or enterprise-tier deployment of the AI service with contractual data handling terms is the middle path.

The underlying principle is Core Principle 8 applied to data: structure the workflow so sensitive content doesn't reach hosted services in prompt form in the first place, rather than trusting that the Builder will exercise discretion about what to include.

**Prompt Engineering for TDD Discipline:** The Builder must be explicitly instructed: *"You are operating under strict TDD. Write tests FIRST. Do NOT write implementation code until I confirm all tests fail. When implementing, write the MINIMUM code to pass each test."* Without this constraint, AI models will naturally try to write implementation and tests simultaneously.

---

### **VII. When to Use VSDD**

**Ecosystem positioning:** On Piskala's three-level SDD rigor taxonomy[^piskala], VSDD sits at **L2+ (Spec-Anchored with formal hardening approaching L3)**. L2 (Spec-Anchored) means the spec is maintained through the full project lifecycle, every change requires an addendum, and full REQ→test→implementation→review traceability is enforced. VSDD adds Phase 6 formal hardening (Kani/TLA+) that pure L2 frameworks do not have, without going full L3 (Spec-as-Source, where code is generated directly from the spec and not manually edited).

**Calibration heuristic (Piskala):** Before choosing a rigor level, answer one question: *"How many times in the past year did someone ask about requirements-to-test traceability?"* Zero times — L1 (Spec-First) is sufficient. Once — move to L2 (VSDD). More than once, or if the project has a greater than 80% chance of being audited — L2 (VSDD) plus CSDD security clauses for the security-critical paths.[^piskala]

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

[^merrill]: Merrill, W., & Sabharwal, A. (2023). The Expressive Power of Transformers with Chain of Thought. *NeurIPS 2023*. arXiv:2310.07923. https://arxiv.org/abs/2310.07923

[^self-refine]: Madaan, A., Tandon, N., Gupta, P., et al. (2023). Self-Refine: Iterative Refinement with Self-Feedback. *NeurIPS 2023*. arXiv:2303.17651. https://arxiv.org/abs/2303.17651

[^reflexion]: Shinn, N., Cassano, F., Berman, E., et al. (2023). Reflexion: Language Agents with Verbal Reinforcement Learning. *NeurIPS 2023*. arXiv:2303.11366. https://arxiv.org/abs/2303.11366

[^debate]: Du, Y., Li, S., Torralba, A., Tenenbaum, J. B., & Mordatch, I. (2023). Improving Factuality and Reasoning in Language Models through Multiagent Debate. arXiv:2305.14325. https://arxiv.org/abs/2305.14325

[^constitutional]: Bai, Y., Kadavath, S., Kundu, S., et al. (2022). Constitutional AI: Harmlessness from AI Feedback. arXiv:2212.08073. https://arxiv.org/abs/2212.08073

[^over-editing]: Nrehiew (2026). Coding Models Are Doing Too Much. https://nrehiew.github.io/blog/minimal_editing/

[^ears]: Mavin, A. (2009). EARS (Easy Approach to Requirements Syntax). IEEE International Requirements Engineering Conference. Originally developed at Rolls-Royce aerospace; eliminates modal ambiguity in requirement statements.

[^iso29148]: ISO/IEC/IEEE 29148:2018. *Systems and software engineering — Life cycle processes — Requirements engineering.* The international standard defining the content and structure of a Software Requirements Specification (SRS): stakeholders, business and functional requirements, non-functional/quality requirements, constraints, and traceability.

[^marri]: Marri, S. R. (2026). Constitutional Spec-Driven Development: Enforcing Security by Construction in AI-Assisted Code Generation. arXiv:2602.02584. https://arxiv.org/abs/2602.02584

[^piskala]: Piskala, D. B. (2026). Spec-Driven Development: From Code to Contract in the Age of AI Coding Assistants. AIWare 2026. arXiv:2602.00180. https://arxiv.org/abs/2602.00180

[^chainlink]: dollspace (2024). Chainlink: local-first AI-native issue tracker. https://github.com/dollspace-gay/chainlink

[^speckit]: GitHub (2025). Spec Kit: Spec-Driven Development toolkit. https://github.com/github/spec-kit

[^codeleash]: CodeLeash (2024). Constraint-based agentic TDD framework. https://codeleash.dev/

[^rlm]: doubleuuser (2024). RLM Workflow: Repository-centric Language Model workflow. https://skills.sh/doubleuuser/rlm-workflow/rlm-workflow

[^dekens]: Dekens, N. (2026). Vibe Coding Is Becoming an OSINT Risk. https://www.dutchosintguy.com/post/vibe-coding-is-becoming-an-osint-risk

[^openssf]: Open Source Security Foundation (OpenSSF). Scorecard: Security health metrics for open source projects. https://securityscorecards.dev/

[^daedalus]: Daw, A. (2026). Daedalus: Architecture documentation pipeline. https://github.com/adamdaw/daedalus

[^superpowers]: Vincent, J. (obra) (2025). Superpowers: AI pair programming skills for Claude Code. https://github.com/obra/superpowers — brainstorming skill implements the Socratic deliberation interaction model referenced in Phase 1 (Requirements Refinement).