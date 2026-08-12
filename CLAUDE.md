# CLAUDE.md

This file only imports the project's shared agent context. Do not add project rules here —
add them to `.agents/AGENTS.md` so every AI coding agent (Claude Code, Codex, Cursor, etc.)
reads the same source of truth.

@.agents/AGENTS.md

`.claude/skills/`, `.claude/plans/` and `.claude/drafts/` mirror `.agents/skills/`,
`.agents/plans/` and `.agents/drafts/` through one-line pointer files, so Claude Code can also
discover them natively. Their content lives only in `.agents/`.
