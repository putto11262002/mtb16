---
description: "Propose a great Conventional Commit message; on approval, stage & commit"
agent: build
---

Goal: Help me commit current changes with an excellent Conventional Commit message.
Rules:
- Require my explicit "Approve" before running any git commands.
- If `$ARGUMENTS` is provided, treat it as the commit **subject override** (e.g. `feat(ui): add modal`); still generate a body.
- Keep subject ≤ 72 chars, imperative mood, no trailing period. Prefer types: feat, fix, docs, refactor, perf, test, build, chore.
- Auto-scope from changed top-level folder(s) when sensible (e.g. `ui`, `api`, `docs`).
- Include a concise body (wrapped ≤ 72 cols) summarizing key changes; add bullet points if >1 change.
- If any breaking change is detected/confirmed, include a `BREAKING CHANGE:` footer.
- If there are no changes, say so and stop.

Context:
- Repo: !`basename "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"`
- Branch: !`git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown`
- Status (staged/unstaged): 
!`git status --porcelain=v1`
- Recent commits:
!`git log --oneline -n 5`
- Diff summary:
!`git diff HEAD`

Tasks:
1) Propose: 
   - A one-line Conventional Commit **subject** (use `$ARGUMENTS` if provided).
   - A short, well-wrapped **body**; bullets OK.
   - Optional `Refs:` footer if issue/PR numbers are evident.
   Show the message in a fenced block for review.
2) Ask: “Approve to commit? (yes/no)”. Do not proceed without an explicit yes.
3) On approval:
   - Stage changes: `git add -A`
   - Commit: `git commit -m "<subject>" -m "<body and footers>"`
4) On rejection: ask what to edit (subject/body) and re-propose.
