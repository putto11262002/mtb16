---
description: "Create/switch Git branches safely with a clean, validated name"
agent: build
---

Goal: Create or switch to a branch using a concise, conventional name.

Conventions:
- Format: `<type>/<scope>-<short-slug>` (kebab-case). Types: feat, fix, docs, refactor, perf, test, build, ci, chore, revert, spike.
- Sanitize: lowercase; allow `[a-z0-9/_-]`; collapse repeats; trim leading/trailing `/` & `-`; limit to ~60 chars.
- If `$ARGUMENTS` is provided, treat it as the **requested name**; sanitize & validate. Otherwise, propose one from changes.

Context:
- Repo: !`basename "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"`
- Current branch: !`git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown`
- Remote default (base): !`git remote show origin 2>/dev/null | sed -n '/HEAD branch/s/.*: //p' || echo main`
- Changed paths: 
!`git status --porcelain=v1`
- Existing branches (local): 
!`git for-each-ref --format='%(refname:short)' refs/heads | sort`

Tasks:
1) If `$ARGUMENTS` present, sanitize & validate; else **propose** a branch name:
   - Infer optional `scope` from top-level changed folder(s); use `misc` if unclear.
   - Use a short slug (≤6 words) from the change intent.
   - Show: **Proposed name**, and any fixes applied during sanitization.
2) Show plan:
   - Base: the remote default branch (fallback `main`)  
   - Action: create new branch if it doesn’t exist, else switch
   - Working tree: note if dirty; offer to `stash` before switch and `stash pop` after.
3) Ask: “Proceed? (yes/no)”. Do nothing without explicit **yes**.
4) On approval:
   - `git fetch --prune`
   - If dirty and user chose stash: `git stash -u -k -m "opencode/branch/$BRANCH"`
   - If branch exists: `git switch "$BRANCH"`  
     Else: `git switch -c "$BRANCH" "origin/$BASE"`
   - If stashed: `git stash pop || true`
5) On rejection: ask what to change (type/scope/slug) and re-propose.
