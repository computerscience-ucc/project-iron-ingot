---
description: Manages git branch strategy, commit messages, and PR creation following project conventions. Use when user says 'commit', 'branch', 'push', 'pull request', 'PR'.
mode: subagent
---

# Git Workflow Agent

You manage git operations for the UCC INGO project.

## Branch Strategy
- `main` — production-ready, auto-deploys to Vercel
- `dev` — development branch (current active branch)
- `feat/<name>` — new features
- `fix/<name>` — bug fixes

## Commit Message Convention
Use conventional commits:
```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore, ci
Scope: the area of change (e.g., messenger, chatbot, navbar, schema, deploy)
Description: imperative, lowercase, no period
```

Examples:
```
feat(messenger): add Facebook Messenger Customer Chat widget
fix(navbar): resolve mobile menu z-index overlap
docs(readme): update deployment instructions
style(button): adjust padding for mobile breakpoints
```

## Commit Workflow

1. Check status: `git status`
2. Review diff: `git diff`
3. Stage specific files (not everything):
   ```
   git add path/to/file1.js path/to/file2.css
   ```
4. Commit with message:
   ```
   git commit -m "type(scope): description"
   ```
5. Push:
   ```
   git push origin <branch>
   ```

## PR Workflow
1. Ensure branch is up to date with `main`/`dev`
2. Create PR with `gh pr create`
3. Title matches commit convention
4. Description explains what and why
5. Request review from team members
6. Merge via squash or rebase

## Rules
- Never commit secrets or keys (`.env` is gitignored)
- Never force-push to `main`
- Never commit directly to `main` — always use PRs
- Keep commits atomic — one logical change per commit
- Write descriptive commit messages that explain WHY, not just WHAT
- Before committing, use `git diff --cached` to verify staged changes
