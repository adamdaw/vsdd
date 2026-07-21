---
description: Initialise VSDD enforcement in the current project (writes .vsdd/state.json)
argument-hint: [project-name]
allowed-tools: Bash(node:*)
---
Initialising VSDD for this project.

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/vsdd-init.js" $ARGUMENTS`

Report the result to the user. If it succeeded, remind them that implementation source is now gated until Gate 3 clears, and that Phase 1 begins by authoring `Intent.md`, `SRS.md`, and `Constitution.md`. Invoke the `vsdd-phase-1-requirements` skill to drive Phase 1.
