---
description: Clear the next VSDD gate and advance the phase (checks required artifacts exist)
allowed-tools: Bash(node:*)
---
Attempting to clear the next VSDD gate.

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/vsdd-advance.js"`

Report the result. If the advance was **refused** for missing artifacts, do not work around it — the named artifacts must genuinely exist and have passed their human + Adversary gate review first. If it **succeeded**, state the new phase and gate progress, and (when Gate 3 was just cleared) note that implementation source is now unlocked.

Before running this, confirm with the user that the gate's review actually passed — `/vsdd-advance` records the gate as cleared; it does not perform the review. The review is driven by the relevant per-phase skill and (for Gates 1–4) the adversarial reviewer agents.
