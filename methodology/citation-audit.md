# Citation Audit — VSDD

Each empirical citation in `VSDD.md` is checked against its primary source and recorded here with the scope of what that source supports. Standards, tools, and the author's prior work are pointers, not empirical claims, and are listed separately.

## Empirical citations

| Citation | What the source establishes | How VSDD uses it |
|---|---|---|
| **Marri (2026)** — *Constitutional Spec-Driven Development*, arXiv:2602.02584 | A single banking-microservices case study reports a 73% reduction in security defects under constitutional constraints versus unconstrained AI generation, with maintained development velocity. | The CSDD security-clause pattern. The 73% figure is scoped as indicative of one case study, not a general result. |
| **Piskala (2026)** — *Spec-Driven Development: From Code to Contract*, arXiv:2602.00180 | A three-level rigor taxonomy — spec-first, spec-anchored, spec-as-source — with guidance on when each applies. The paper states no percentage for project suitability at any level. | The L1–L3 positioning (VSDD sits at L2+). The §VII calibration heuristic is VSDD's own, informed by the taxonomy — not a Piskala claim or statistic. |
| **Bai et al. (2022)** — *Constitutional AI*, arXiv:2212.08073 | A model is trained for harmlessness via AI feedback (RLAIF) against a list of principles; the "constitution" governs training. | An analogy for treating the spec as a constitution — explicitly not as evidence, since VSDD enforces its spec by adversarial review, not RL. |
| **Du et al. (2023)** — *Multiagent Debate*, arXiv:2305.14325 | Debate among model instances improves factuality and reasoning. | That result. The further point that identical instances converge on shared biases is VSDD's design hypothesis, not a result the paper establishes. |
| **Madaan et al. (2023)** — *Self-Refine*, arXiv:2303.17651 | Iterative self-feedback improves model outputs across tasks (~20% absolute on average). | The basis for the Builder's pre-flight self-review — not a claim that self-review substitutes for adversarial review. |
| **Mavin (2009)** — *EARS*, IEEE Requirements Engineering Conference | EARS constrains requirement phrasing to reduce modal ambiguity by mandating SHALL/MUST. | The requirement syntax. VSDD states EARS reduces *modal*, not semantic, ambiguity. |

## Pointers (not empirical claims)

- **Standards:** ISO/IEC/IEEE 29148, ISO/IEC 25010, arc42.
- **Tools / reference implementations:** Chainlink, Spec Kit, CodeLeash, RLM Workflow, OpenSSF Scorecard, Daedalus, Superpowers.
- **Author's prior work:** Daw (2026), *Five Categories of Human Excellence in the Age of AI*.
