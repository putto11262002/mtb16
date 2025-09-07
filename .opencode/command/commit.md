---
description: "Plan coherent Conventional Commits; on approval, stage & commit per group"
agent: build
---

Goal: Turn current changes into one or more **coherent commits** using Conventional Commits. Always preview the plan; do nothing without explicit approval.

Arguments:
- `$ARGUMENTS` can include hints (space-separated): 
  - `single` | `type=<feat|fix|...>` | `scope=<x>` 
  - `include=<glob>` `exclude=<glob>` 
  - `with-lock` (fold lockfiles into deps commit)
  - Example: `/commit type=fix scope=auth exclude=**/*.snap`

Conventions:
- Subject: `<type>(<scope>): <desc>` (≤72 chars, imperative). Common types: feat, fix, docs, refactor, perf, test, build, ci, chore, revert, style.  
- Body: wrap ~72 cols, bullets ok.  
- Footer: add `BREAKING CHANGE:` when applicable. :contentReference[oaicite:0]{index=0}

Context (for analysis):
- Repo: !`basename "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"`
- Branch: !`git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown`
- Status: 
!`git status --porcelain=v1`
- Name/status with renames:
!`git diff --name-status --find-renames`
- Size stats:
!`git diff --numstat`
- Recent commits:
!`git log --oneline -n 5`

Heuristics (grouping, in priority order):
1) **Deps/lockfiles**: `pnpm-lock.yaml|yarn.lock|package-lock.json|go.sum|Cargo.lock|vendor/**` → `chore(deps): …` (separate).  
2) **Config/infra**: `.github/**`, CI, lint/format configs, Dockerfile, build scripts → `ci:` / `build:` / `chore(config):` (separate).  
3) **Docs-only**: `**/*.md`, `docs/**` → `docs:` (don’t mix with code).  
4) **Format-only**: if `git diff -w` shows no semantic change → `style:` (separate).  
5) **Tests**: `**/*.test.*|**/*.spec.*|__tests__/**|**/__snapshots__/**` → `test:`; pair with related feature/fix if clearly scoped, else separate.  
6) **DB/Migrations**: `migrations/**|prisma/**|drizzle/**|src/db/schema.*` → own commit (`feat(db):` or `chore(db):`).  
7) **Refactors**: mostly renames/moves or low net LOC without behavior change → `refactor(scope):`.  
8) **Features vs Fixes**: new capability → `feat(scope):`; bug correction → `fix(scope):`.  
9) **Assets**: large media/icons → `chore(assets):` (or pair if small & clearly tied).  
10) **Generated/Build artifacts**: `dist/**|*.gen.*` → exclude by default; prompt before including.  

Scope inference:
- Prefer top-level folder (`src/ui`, `apps/web`, `packages/api` → `ui`, `web`, `api`).  
- Fallback to branch slug prefix (e.g. `feat/auth-login` → `auth`).  
- Allow override via `$ARGUMENTS`.

Size guardrails:
- Target ≤ ~15 files or ≤ ~300 net LOC per commit; split by sub-scope or filetype when larger.

Flow:
1) **Analyze** changes and assemble a **Commit Plan**: for each group show → type/scope, file count & shortstat, and proposed **subject**.  
2) Draft **full messages** (subject + body + optional footers) for all groups; render them in fenced blocks.  
3) Ask: **“Approve plan? (yes/no)”** with options to `edit <group>`, `merge <a> <b>`, `split <group> by <rule>`, `include/exclude <glob>`.  
4) On approval, for each group in order (config → refactor → feat → fix → test → docs → assets → deps):  
   - Stage exactly those files: `git add -- <files>`  
   - Commit: `git commit -m "<subject>" -m "<body_and_footers>"`  
5) If there are **staged** changes at start, ask whether to commit **staged only** or restage per plan.  
6) If **no changes**, report and exit.

Notes:
- Use `$ARGUMENTS` if the user supplied a subject override for the **primary** group; still generate bodies.  
- Keep everything interactive; never run git without an explicit “yes”.

Tip:
- This command relies on **command arguments** (`$ARGUMENTS`) and **shell output injection** (`!` backticks) supported by OpenCode custom commands. Place this file in `.opencode/command/`; the filename becomes the slash command. :contentReference[oaicite:1]{index=1}
