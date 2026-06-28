# Citation Audit — VSDD

Each empirical citation in `VSDD.md` is checked against its primary source and recorded here with the scope of what that source supports and the location in the source where the claim is found. Conceptual frameworks and analogies VSDD adopts (not offered as evidence) are listed separately, as are pointers — standards, tools, practitioner sources, and the author's prior work.

**Verification method.** Each claim is checked against the **full text of the primary source** — cited by arXiv ID in each row, or by venue for the EARS paper — not against a summary, on the verification date shown. "Source locator" names where in the source the claim appears, so any reader can fetch the public source and confirm it independently.

## Empirical citations

| Citation | What the source establishes | How VSDD uses it | Source locator (verified 2026-06-27) |
|---|---|---|---|
| **Marri (2026)** — *Constitutional Spec-Driven Development*, arXiv:2602.02584 | A single banking-microservices case study reports a 73% reduction in security defects under constitutional constraints versus unconstrained AI generation, with maintained developer velocity. | The CSDD security-clause pattern. The 73% figure is scoped as indicative of one case study, not a general result. | Abstract ("reduce security defects by 73% … while maintaining developer velocity"); §C4 Reference Implementation (the banking-microservices case study); results ("73% reduction … 56% faster time to first secure build"); conclusion. |
| **Du et al. (2023)** — *Multiagent Debate*, arXiv:2305.14325 | Debate among model instances improves factuality and reasoning. | That result. The further point that identical instances converge on shared biases is VSDD's design hypothesis, not a result the paper establishes. | Abstract and results (multiagent debate improves factual accuracy and reasoning across tasks). |
| **Madaan et al. (2023)** — *Self-Refine*, arXiv:2303.17651 | Iterative self-feedback improves model outputs, ~20% absolute on average across tasks. | The basis for the Builder's pre-flight self-review — not a claim that self-review substitutes for adversarial review. | Abstract ("improving by ∼20% absolute on average in tasks"). |
| **Mavin (2009)** — *EARS*, IEEE Requirements Engineering Conference | EARS provides five SHALL-based requirement templates that reduce ambiguity, vagueness, and complexity (the paper's named problem classes; the ambiguity forms it treats are lexical, referential, and syntactical). | The requirement syntax. The **modal-discipline framing** — mandating SHALL/MUST, forbidding *should/may/could/might*, and the "modal ambiguity" characterisation — is **VSDD's own extension, not a Mavin claim**. VSDD also admits the RFC-2119 MUST as an obligation keyword (not canonical EARS). | The generic requirement syntax — the five SHALL-based templates ("The &lt;system name&gt; shall &lt;system response&gt;"). The paper frames its benefit as reducing ambiguity/vagueness/complexity, not "modal ambiguity"; "must" appears only as incidental prose, never as a template keyword. |

## Frameworks and analogies (not empirical evidence)

| Citation | What the source establishes | How VSDD uses it | Source locator (verified 2026-06-27) |
|---|---|---|---|
| **Piskala (2026)** — *Spec-Driven Development: From Code to Contract*, arXiv:2602.00180 | A three-level rigor taxonomy — spec-first, spec-anchored, spec-as-source (the paper's own named levels; it uses no L1/L2/L3 labels) — with guidance on when each applies. The paper states no percentage for project suitability at any level. | The named-level positioning (VSDD sits at L2+) — a conceptual framework, not a statistic. *L1/L2/L3 is VSDD's shorthand for Piskala's named levels*, not the paper's labels. The §VII calibration heuristic is VSDD's own, informed by the taxonomy, not a Piskala claim. | The named-level taxonomy sections (spec-first / spec-anchored / spec-as-source; no L1/L2/L3 labels appear in the source). The only percentages in the paper are an unrelated "up to 50%" boosting effect and a "75% reduction in integration cycle time"; neither concerns project suitability — confirming no suitability percentage exists. |
| **Bai et al. (2022)** — *Constitutional AI*, arXiv:2212.08073 | A model is trained for harmlessness via AI feedback (RLAIF) against a list of principles; the "constitution" governs training. | An analogy for treating the spec as a constitution — explicitly *not* as evidence, since VSDD enforces its spec by adversarial review, not RL. | Abstract and method (RLAIF against a principle list; the constitution governs training, not a spec). |

## Pointers (not empirical claims)

- **Standards:** ISO/IEC/IEEE 29148, ISO/IEC 25010, arc42.
- **Tools / reference implementations:** Chainlink, Spec Kit, CodeLeash, RLM Workflow, OpenSSF Scorecard, Daedalus, Superpowers.
- **Practitioner sources (claims attributed in-text, not peer-reviewed evidence):** Nrehiew, *Coding Models Are Doing Too Much* (the over-editing argument); Dekens, *Vibe Coding Is Becoming an OSINT Risk* (the spec-confidentiality argument).
- **Author's prior work:** Daw (2026), *Five Categories of Human Excellence in the Age of AI*.
