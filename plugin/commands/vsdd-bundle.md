---
description: Export the Adversary's admitted-only reviewer workspace for a gate (§A.17) and write its manifest
argument-hint: "<gate 1-4> [ITEM-NNN]"
allowed-tools: Bash(node:*)
---
Assembling the Gate $1 reviewer bundle.

!`node "${CLAUDE_PLUGIN_ROOT}/scripts/vsdd-bundle.js" $ARGUMENTS`

Spawn the gate's reviewer against the **exported workspace path**, never the repository, and commit the manifest alongside the pass record — a gate whose bundle cannot be shown to have excluded the withheld paths has not established independence (§A.17, Principle 11).

If the run was **refused** for a leaked withheld path, do not work around it: the project's `evidence` rules in `.vsdd/state.json` disagree with what its artifact paths sweep in. Fix the paths.

State the residual limit when reporting: the export gives a human reviewer genuine evidence isolation and both reviewers an audit trail, but an AI reviewer shares this filesystem and can read the repository around the bundle. Curating the prompt remains necessary; it is not sufficient.
