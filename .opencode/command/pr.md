---
description: "Create a GitHub PR with a great title/body; enable auto-merge (squash) on approval"
agent: build
---

Goal: Create a Pull Request from the current branch using a high-quality title/body and the squash merge strategy.

Rules:
- If `$ARGUMENTS` is provided, treat it as the **PR title override**; still generate/merge a body from the template.
- Detect base branch from remote HEAD; fallback to `main`.
- If `.github/pull_request_template.md` (or `pull_request_template.md` / `docs/pull_request_template.md`) exists, prefer it; else use the **inline template** below.
- Show title & body for approval before running `gh` commands. No actions without explicit **yes**.
- If repo supports auto-merge, offer to enable **auto-merge (squash)** after PR creation.

Context:
- Repo: !`basename "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"`
- Branch: !`git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown`
- Remote default (base): !`git remote show origin 2>/dev/null | sed -n '/HEAD branch/s/.*: //p' || echo main`
- Changed files (since base): 
!`git fetch -q origin; git diff --name-status $(git merge-base HEAD origin/$(git remote show origin | sed -n '/HEAD branch/s/.*: //p' || echo main))..HEAD`
- Recent commits on this branch: 
!`git log --oneline $(git merge-base HEAD origin/$(git remote show origin | sed -n '/HEAD branch/s/.*: //p' || echo main))..HEAD`

Template (fallback if no repo template is present):
```

# Summary

* {one-sentence purpose / problem / approach}

# Changes

* {bulleted list of key changes}

# Screenshots / Demos

* {optional}

# Tests & Verification

* {manual/automated checks, how to reproduce}

# Risks / Rollback

* {impact, mitigation, rollback plan}

# Checklist

* [ ] Code builds & lints
* [ ] Tests updated/added if needed
* [ ] Docs/README updated if needed

Refs: {#issue(s) or links}

```

Tasks:
1) Build a concise PR **title** (≤72 chars, imperative). Use `$ARGUMENTS` if given.
2) Assemble the PR **body**:
   - If a repo PR template exists, load it and fill concise bullets from the diff/commits.
   - Else use the inline template above.
   - Keep lines wrapped ~72 cols.
3) Show the proposed **title** and **body** in a fenced block and ask: “Create PR now? (yes/no)”
4) On approval:
   - Ensure branch is pushed: `git push -u origin HEAD` (if needed)
   - Create PR with GitHub CLI:
     - `gh pr create -t "<TITLE>" -b "<BODY>" -B "<BASE>" -H "$(git rev-parse --abbrev-ref HEAD)"`
   - Capture PR number/URL and display it.
   - Ask: “Enable auto-merge with **squash**? (yes/no)”
     - If yes: `gh pr merge --squash --auto` (targeting the just-created PR)
5) On rejection: ask what to edit (title/body) and re-propose.

Notes:
- `gh pr create` creates the PR; `gh pr merge --squash --auto` enables auto-merge using the squash strategy if the repo allows it. If auto-merge isn’t enabled on the repo, explain and skip.
