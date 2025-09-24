---
description: "Propose a great Conventional Commit message; on approval, commit staged changes only"
agent: build
---

## Objective
Help me commit **only the currently staged changes** with an excellent Conventional Commit message.

## Input
- `$ARGUMENTS` (optional): Treat as a **subject override** (e.g. `feat(ui): add modal`). Still generate a body.

## Context
- Repo: !`basename "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"`
- Branch: !`git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown`
- Staged changes (to be committed):  
!`git diff --cached --name-status`
- Unstaged changes (won’t be committed):  
!`git diff --name-status`
- Status (porcelain):  
!`git status --porcelain=v1`
- Recent commits:  
!`git log --oneline -n 5`

## Rules
- Require my explicit **"yes"** to approve before running any git commands.
- If `$ARGUMENTS` is provided, use it as the **subject**; still generate a body.
- Subject: ≤ 72 chars, imperative mood, no trailing period.
- Prefer types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `chore`.
- Auto-scope from **staged** top-level folder(s) when sensible (e.g. `ui`, `api`, `docs`).
- Body: concise, wrapped ≤ 72 cols; use bullets if >1 change.
- If any breaking change is detected/confirmed, include `BREAKING CHANGE:` footer.
- If **no staged changes**, say so and stop (even if unstaged changes exist).

## Operational Workflow
1) **Analyze staged diffs** to infer type/scope and summarize key changes.
2) **Draft message**:
   - Subject (use `$ARGUMENTS` if provided; otherwise generate).
   - Body (bulleted if multiple notable changes).
   - Optional `Refs:` footer when issue/PR numbers are evident.
3) **Show for review** in a fenced block (subject on first line, then blank line, then body/footers).
4) **Ask**: “Approve to commit **staged changes only**? (yes/no)”
5) On **approval**:
   - Verify there is something staged: `git diff --cached --quiet || true`
     - If nothing staged, report “No staged changes” and stop.
   - Commit staged changes only:  
     `git commit -m "<subject>" -m "<body and footers>"`
6) On **rejection**: ask what to edit (subject/body) and re-propose.

## Done checklist
- [ ] Subject ≤ 72 chars, imperative, Conventional Commit type (and scope if sensible).
- [ ] Body wraps at ≤ 72 cols; includes bullets when helpful.
- [ ] Any breaking changes noted with `BREAKING CHANGE:` footer.
- [ ] `Refs:` footer added when issues/PRs are evident.
- [ ] Explicit approval received before running any git commands.
- [ ] Commit includes **only staged** files; no new files were staged.
- [ ] If nothing staged, clearly informed and exited.

## Output
1) A preview of the proposed commit message in a fenced block:
