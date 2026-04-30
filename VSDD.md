# **Verified Spec-Driven Development (VSDD)**

## **The Fusion: VDD × TDD × SDD for AI-Native Engineering**

### **Overview**

**Verified Spec-Driven Development (VSDD)** is a unified software engineering methodology that fuses three proven paradigms into a single AI-orchestrated pipeline:

- **Spec-Driven Development (SDD):** Define the contract before writing a single line of implementation. Specs are the source of truth.
- **Test-Driven Development (TDD):** Tests are written *before* code. Red → Green → Refactor. No code exists without a failing test that demanded it.
- **Verification-Driven Development (VDD):** Subject all surviving code to adversarial refinement until a hyper-critical reviewer is forced to hallucinate flaws.

VSDD treats these not as competing philosophies but as **sequential gates** in a single pipeline.[^merrill] Specs define *what*. Tests enforce *how*. Adversarial verification ensures *nothing was missed*. AI models orchestrate every phase, with the human developer serving as the strategic decision-maker and final authority.

---

### **I. The VSDD Toolchain**

| Role | Entity | Function |
| --- | --- | --- |
| **The Architect** | Human Developer | Strategic vision, domain expertise, acceptance authority. Signs off on specs, arbitrates disputes between Builder and Adversary. |
| **The Builder** | Claude (or similar) | Spec authorship, test generation, code implementation, and refactoring. Operates under strict TDD constraints. |
| **The Tracker** | AI agent or issue system | Hierarchical issue decomposition — Epics → Issues → Sub-issues. Every spec, test, and implementation maps to a work item. |
| **The Adversary** | AI agent (fresh context) | Hyper-critical reviewer with zero tolerance. Reviews specs, tests, *and* implementation. Fresh context on every pass. |

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
Scope-bound to the spec — implements only what the spec authorises. Cannot make architectural decisions; surfaces ambiguities to the Architect rather than resolving them unilaterally. No implementation code without a prior failing test. No commits to main; all work on branches with a PR required. Output authority is limited to: implementation, tests, and documentation updates.

**Context**
Needs: the converged spec, the test suite, and the current work item. Does *not* need stakeholder conversation history, prior failed approaches (anchors on wrong paths), or the Adversary's full review history. Fresh context per session is recommended to prevent accumulated bias.

**Curation**
From the spec: extracts only the requirements relevant to the current work item. From the test suite: identifies the specific failing test to satisfy. Filters out everything outside the current work item's scope — no opportunistic additions.

**Conceptualization**
Frames every task as: *"What is the minimal implementation that makes this test pass?"* Red-green-refactor, not "build the feature." Every line of code is a response to a specific test, which is a response to a specific spec requirement.

**Creativity**
Narrow and bounded: algorithm choice, code structure, naming — all within the spec's constraints. When implementation choices diverge due to genuine spec ambiguity, the Builder surfaces the decision to the Architect rather than choosing. The Builder's creativity is craft, not direction.

---

#### The Adversary *(AI agent, fresh context)*

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

**Context**
Needs: the converged spec, the current implementation state, and the test suite. Does *not* need the Adversary's review history or architectural decision rationale — only the decisions themselves. In team contexts, also needs the current sprint and backlog state from the team's issue tracker.

**Curation**
Extracts atomic, independently testable units of work from the spec. Prioritises work items that unblock other work items — decomposition is dependency-aware. Flags work items where the spec is insufficiently specific to enable a test, surfacing the gap to the Architect rather than the Builder.

**Conceptualization**
Frames every task as: *"What is the smallest unit of work that is independently testable and traceable to the spec?"* The Tracker's mental model is the dependency graph, not the feature list. A well-decomposed backlog where every work item is atomic, testable, and traceable is the Tracker's convergence signal.

**Creativity**
Different decomposition strategies carry different risk profiles when spec changes arrive. The Tracker's creativity is in finding the slice that minimises rework. It also flags when decomposition reveals that two apparently separate work items are actually coupled — which is a spec gap requiring Architect attention, not a Builder workaround.

---

### **III. The VSDD Pipeline**

#### **Phase 1 — Spec Crystallization**

*Nothing gets built until the contract is airtight — and the architecture is verification-ready by design.*

The human developer describes the feature intent to the Builder. The Builder then produces a **formal specification document** for each unit of work. Critically, this phase doesn't just define *what* the software does — it defines *what must be provable about it* and structures the architecture accordingly.

**Step 1a: Behavioural Specification**

The Builder produces the functional contract:

- **Behavioural Contract:** What the module/function/endpoint *must* do, expressed as preconditions, postconditions, and invariants.
- **Interface Definition:** Input types, output types, error types. No ambiguity. If it's an API, this is the OpenAPI/GraphQL schema. If it's a module, this is the type signature and doc contract.
- **Edge Case Catalog:** Explicitly enumerated boundary conditions, degenerate inputs, and failure modes. The Builder is prompted to be *exhaustive* here — "What happens when the input is null? Empty? Maximum size? Negative? Unicode? Concurrent?"
- **Non-Functional Requirements:** Performance bounds, memory constraints, security considerations baked into the spec itself.

**Step 1b: Verification Architecture**

Before any implementation design is finalised, the Builder produces a **Verification Strategy** that answers: *"What properties of this system must be mathematically provable, and what architectural constraints does that impose?"*

This includes:

- **Provable Properties Catalog:** Which invariants, safety properties, and correctness guarantees must be formally verified — not just tested? Examples: "This state machine can never reach an invalid state." "This arithmetic can never overflow." "This parser always terminates." "This access control check is never bypassed." The Builder distinguishes between properties that *should* be proven (critical path, security boundaries, financial calculations) and properties where test coverage is sufficient (UI formatting, logging, non-critical defaults).
- **Purity Boundary Map:** A clear architectural separation between the **deterministic, side-effect-free core** (where formal verification can operate) and the **effectful shell** (I/O, network, database, user interaction). This is the most consequential design decision in VSDD — it dictates module boundaries, dependency direction, and how state flows through the system. The pure core must be designed so that verification tools can reason about it without mocking the entire universe.
- **Verification Tooling Selection:** Based on the language and the properties to be proven, the Builder selects the appropriate formal verification stack (Kani for Rust, CBMC for C/C++, Dafny, TLA+ for distributed systems, etc.) and identifies any constraints these tools impose on code structure. This happens *now*, not after the code is written, because tool constraints are architectural constraints.
- **Property Specifications:** Where possible, the Builder drafts the actual formal property definitions (e.g., Kani proof harnesses, Dafny contracts, TLA+ invariants) alongside the behavioural spec. These aren't implementation — they're the formal expression of what the spec already says in natural language. They serve as a second, mathematically precise encoding of the requirements.

**Why this must happen in Phase 1:** If the system is designed with side effects woven through the core logic, no amount of Phase 5 heroics will make it verifiable. A function that reads from a database, performs a calculation, and writes to a log in one block cannot be formally verified without mocking infrastructure that the verifier may not support. But a function that takes data in, returns a result, and lets the caller handle persistence — that's a function a model checker can reason about. This boundary must be drawn at the spec level because it fundamentally shapes the module decomposition, the dependency graph, and the testing strategy that follows.

**Step 1c: Spec Review Gate**

The complete spec — behavioural contracts *and* verification architecture — is reviewed by *both* the human and the Adversary before any tests are written. The Adversary tears into the spec looking for:

- Ambiguous language that could be interpreted multiple ways
- Missing edge cases
- Implicit assumptions that aren't stated
- Contradictions between different parts of the spec
- **Properties claimed as "testable only" that should be provable** (the Adversary pushes back on lazy verification boundaries)
- **Purity boundary violations** — logic marked as "pure core" that actually depends on external state
- **Verification tool mismatches** — properties the selected tooling can't actually prove

The spec is iterated until the Adversary can't find legitimate holes in either the behavioural contract or the verification strategy.

**Tracker Integration:** Each spec maps to a work item. Sub-items are generated for each behavioural contract item, edge case, non-functional requirement, *and* each formally provable property. The provable properties get their own work item chain so their status is tracked independently from test coverage.

---

#### **Phase 2 — Test-First Implementation (The TDD Core)**

*Red → Green → Refactor, enforced by AI.*

With an airtight spec in hand, the Builder now writes tests — and *only* tests. No implementation code yet.

**Step 2a: Test Suite Generation**

The Builder translates the spec directly into executable tests:

- **Unit Tests:** One or more tests per behavioural contract item. Every postcondition becomes an assertion. Every precondition violation becomes a test that expects a specific error.
- **Edge Case Tests:** Every item in the Edge Case Catalog becomes a test. These are the tests that catch the bugs that "never happen in production" (until they do).
- **Integration Tests:** Tests that verify the module works correctly within the larger system context defined in the spec.
- **Property-Based Tests:** Where applicable, the Builder generates property-based tests (e.g., using Hypothesis, fast-check, or proptest) that assert invariants hold across randomised inputs.

**The Red Gate:** All tests must *fail* before any implementation begins. If a test passes without implementation, the test is suspect — it's either testing the wrong thing or the spec was wrong. The Builder flags this for human review.

**Step 2b: Minimal Implementation**

The Builder writes the *minimum* code necessary to make each test pass, one at a time. This is classic TDD discipline:

1. Pick the next failing test.
2. Write the smallest implementation that makes it pass.
3. Run the full suite — nothing else should break.
4. Repeat.

**Step 2c: Refactor**

After all tests are green, the Builder refactors for clarity, performance, and adherence to the non-functional requirements in the spec. The test suite acts as the safety net — if refactoring breaks something, the tests catch it immediately.

**Human Checkpoint:** The developer reviews the test suite and implementation for alignment with the "spirit" of the spec. AI can miss intent even when it nails the letter of the contract.

**Step 2d: Builder Self-Review**

Before handing off to the Adversary, the Builder performs a self-critique pass against the spec. This is not a replacement for adversarial review — it is a pre-flight check that surfaces issues the Builder can identify from its own position. Prompt: *"Review your implementation against the spec. Identify anything incomplete, inconsistent with the spec, or likely to fail adversarial scrutiny. Fix what you can; escalate what cannot be resolved without Architect input."* Self-review with explicit prompting yields measurable improvement before external review; the Adversary then focuses on what self-review cannot reach.[^self-refine]

---

#### **Phase 3 — Adversarial Refinement**

*The code survived testing. Now it faces the Adversary.*

The verified, test-passing codebase — along with the spec and test suite — is presented to the Adversary in a fresh context window. This is a **standing gate**: the Adversary runs on every PR before merge, not only at spec completion.

**What the Adversary reviews:**

1. **Spec Fidelity:** Does the implementation actually satisfy the spec, or did the tests inadvertently encode a misunderstanding? The Adversary treats the spec as a constitution: the implementation must satisfy it fully and explicitly, not approximately. There is no partial credit for "mostly implemented" or "intended to satisfy" — either the requirement is met, demonstrably, or it is not.[^constitutional]
2. **Test Quality:** Are the tests actually testing what they claim? Are there tests that would pass even if the implementation were subtly wrong? (Tautological tests, tests that mock too aggressively, tests that assert on implementation details rather than behaviour.)
3. **Code Quality:** Placeholder comments, generic error handling, inefficient patterns, hidden coupling, missing resource cleanup, race conditions.
4. **Security Surface:** Input validation gaps, injection vectors, authentication/authorisation assumptions.
5. **Spec Gaps Revealed by Implementation:** Sometimes writing the code reveals that the spec was incomplete. The Adversary looks for implemented behavior that isn't covered by the spec.
6. **Process Properties:** For PRs — branch used, CI green, documentation updated, change traceable to a spec requirement.

**Negative Prompting:** The Adversary is configured for zero tolerance. No "overall this looks good, but..." preamble. Every piece of feedback is a concrete flaw with a specific location and a proposed fix or question.

**Context Reset:** Fresh context window on every adversarial pass. No relationship drift. No accumulated goodwill.

---

#### **Phase 4 — Feedback Integration Loop**

The Adversary's critique feeds back through the entire pipeline:

- **Spec-level flaws** → Return to Phase 1. Update the spec, re-review.
- **Test-level flaws** → Return to Phase 2a. Fix or add tests, verify they fail against the current implementation (or a deliberately broken version), then fix implementation if needed.
- **Implementation-level flaws** → Return to Phase 2c. Refactor, ensure all tests still pass.
- **New edge cases discovered** → Add to spec's Edge Case Catalog, write new failing tests, implement fixes.

This loop continues until convergence (see Phase 6).

---

#### **Phase 5 — Formal Hardening (Executing the Verification Plan)**

The verification architecture designed in Phase 1b is now *executed* against the battle-tested implementation. Because the codebase was architected from the start with a pure core and clear purity boundaries, formal verification tools can operate on it without heroic refactoring.

- **Proof Execution:** The property specifications drafted in Phase 1b (Kani harnesses, Dafny contracts, TLA+ invariants, etc.) are run against the implementation. Because the architecture was designed for verifiability, these proofs should engage cleanly with the pure core. Failures here indicate either implementation bugs or spec properties that need refinement — both feed back through Phase 4.
- **Fuzz Testing:** Structured fuzzing (AFL++, libFuzzer, cargo-fuzz) is layered on top of property-based tests to find inputs that no human or AI anticipated. The deterministic core is an ideal fuzz target because it has no environmental dependencies to mock.
- **Security Hardening:** Suites like **Wycheproof** (cryptographic edge cases) and **Semgrep** (static analysis) are run as CI/CD gates.
- **Mutation Testing:** Tools like **mutmut** or **Stryker** mutate the code to verify the test suite actually catches real bugs. If a mutation survives, the test suite has a gap.
- **Purity Boundary Audit:** A final check that the purity boundaries defined in Phase 1b have been respected throughout implementation. Any side effects that crept into the pure core during development are flagged and refactored out.

All formal verification and fuzzing results feed back into Phase 4 if issues are found.

---

#### **Phase 6 — Convergence (The Exit Signal)**

VSDD inherits VDD's **hallucination-based termination**, extended across all three dimensions:

| Dimension | Convergence Signal |
| --- | --- |
| **Spec** | The Adversary's spec critiques are nitpicks about wording, not about missing behaviour, ambiguity, or verification gaps. |
| **Tests** | The Adversary can't identify a meaningful untested scenario. Mutation testing confirms high kill rate. |
| **Implementation** | The Adversary is forced to invent problems that don't exist in the code. |
| **Verification** | All properties from the Phase 1b catalog pass formal proof. Fuzzers find nothing. Purity boundaries are intact. |
| **Edit minimality** | No unrequested structural changes — no nesting, branching, or control flow introduced beyond what each fix required. Diff scope matches work item scope. |

**Maximum Viable Refinement** is reached when all four dimensions have converged. The software is considered **Zero-Slop** — every line of code traces to a spec requirement, is covered by a test, has survived adversarial scrutiny, and the critical path is formally proven.

---

### **IV. The VSDD Contract Chain**

One of VSDD's defining properties is **full traceability**. Every artifact links back:

```
Spec Requirement → Verification Property → Work Item → Test Case → Implementation → Adversarial Review → Formal Proof
```

At any point, you can ask: *"Why does this line of code exist?"* and trace it all the way back to a specific spec requirement, through the verification property it satisfies, the test that demanded it, the adversarial review that hardened it, and the formal proof that guarantees it. Equally, you can ask *"Why is this module structured as a pure function?"* and trace that decision back to the Purity Boundary Map in Phase 1b.

---

### **V. Core Principles of VSDD**

1. **Spec Supremacy:** The spec is the highest authority below the human developer. Tests serve the spec. Code serves the tests. Nothing exists without a reason traced to the spec.

2. **Verification-First Architecture:** The need for formal provability shapes the design, not the other way around. Pure core, effectful shell. If you can't verify it, you architected it wrong — and you find that out in Phase 1, not Phase 5.

3. **Red Before Green:** No implementation code is written until a failing test demands it. AI models are explicitly constrained to follow TDD discipline — no "let me just write the whole thing and add tests after."

4. **Anti-Slop Bias:** The first "correct" version is assumed to contain hidden debt. Trust is earned through adversarial survival, not initial appearance.

5. **Forced Negativity:** Adversarial pressure bypasses the politeness filters of standard LLM interactions. The Adversary doesn't care about your feelings — it cares about your invariants.

6. **Traceability:** The Tracker ensures every spec item, test, and line of code has a corresponding tracked work item. Nothing slips through the cracks.

7. **Entropy Resistance:** Context resets on every adversarial pass prevent the natural degradation of long-running AI conversations. The spec is the persistent cross-episode record — what persists between passes is the spec and formal artefacts, not conversational history or prior review feedback. Entropy Resistance does not mean forgetting; it means that what is remembered is the spec, not the relationship.[^reflexion]

8. **Four-Dimensional Convergence:** The system isn't done until specs, tests, implementation, *and* formal proofs have all independently survived adversarial review.

---

### **VI. AI Orchestration Notes**

VSDD is explicitly designed for multi-model AI workflows:

- **The Builder** benefits from large context windows and strong code generation (Claude, GPT-4, etc.). It needs to hold the full spec, test suite, and implementation simultaneously.
- **The Adversary** benefits from a *different* model or configuration — and more importantly, from structurally opposed objectives. VSDD uses build vs. break role separation, not merely different model instances with different parameters. Multi-agent debate between identical instances still converges on shared biases; genuinely opposed objectives force the disagreement that surfaces real flaws.[^debate]
- **The Human** is not a bottleneck — they're the strategic layer. They approve specs, resolve disputes, and make judgment calls that AI can't. The human's role is *elevated*, not diminished, by the AI orchestration.

**Prompt Engineering for TDD Discipline:** The Builder must be explicitly instructed: *"You are operating under strict TDD. Write tests FIRST. Do NOT write implementation code until I confirm all tests fail. When implementing, write the MINIMUM code to pass each test."* Without this constraint, AI models will naturally try to write implementation and tests simultaneously.

---

### **VII. When to Use VSDD**

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

[^5cs]: Daw, A. (2026). *Five Categories of Human Excellence in the Age of AI*. https://adamdaw.com/writing/five-categories-of-human-excellence/

[^merrill]: Merrill, W., & Sabharwal, A. (2023). The Expressive Power of Transformers with Chain of Thought. *NeurIPS 2023*. arXiv:2310.07923. https://arxiv.org/abs/2310.07923

[^self-refine]: Madaan, A., Tandon, N., Gupta, P., et al. (2023). Self-Refine: Iterative Refinement with Self-Feedback. *NeurIPS 2023*. arXiv:2303.17651. https://arxiv.org/abs/2303.17651

[^reflexion]: Shinn, N., Cassano, F., Berman, E., et al. (2023). Reflexion: Language Agents with Verbal Reinforcement Learning. *NeurIPS 2023*. arXiv:2303.11366. https://arxiv.org/abs/2303.11366

[^debate]: Du, Y., Li, S., Torralba, A., Tenenbaum, J. B., & Mordatch, I. (2023). Improving Factuality and Reasoning in Language Models through Multiagent Debate. arXiv:2305.14325. https://arxiv.org/abs/2305.14325

[^constitutional]: Bai, Y., Kadavath, S., Kundu, S., et al. (2022). Constitutional AI: Harmlessness from AI Feedback. arXiv:2212.08073. https://arxiv.org/abs/2212.08073

[^over-editing]: Nrehiew (2026). Coding Models Are Doing Too Much. https://nrehiew.github.io/blog/minimal_editing/

[^snell]: Snell, C., Klein, D., & Zhong, V. (2022). Learning by Distilling Context. arXiv:2209.15189. https://arxiv.org/abs/2209.15189
