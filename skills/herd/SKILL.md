---
name: herd
description: Manage Claude Code sessions across terminal tabs — list running sessions, open new ones, fork, close, inspect output, and send input. Use this when working with multiple parallel Claude Code sessions.
---

You are managing Claude Code sessions using the `herd` CLI (Agent Herder).

## First: Ensure herd is available

Run all herd commands via `npx`:

```bash
npx @generativereality/agentherder sessions
npx @generativereality/agentherder new <name> <dir>
```

If `herd` is already on PATH (check with `which herd`), you can use `herd` directly instead of `npx @generativereality/agentherder`.

Do NOT attempt to install herd globally, modify PATH, or fix npm configuration. Just use `npx`.

---

Each session runs in its own terminal tab. `herd` lets you — and other Claude Code sessions — introspect and orchestrate the full session fleet.

## Quick Reference

```bash
herd sessions                          # list all tabs with session status
herd list                              # list all workspaces, tabs, and blocks
herd new <name> [dir] [-w workspace] [-p "prompt"] [-f file]  # new tab + claude
herd resume <name> [dir]               # new tab + claude --continue
herd fork <tab-name> [-n new-name]     # fork a session into a new tab
herd close <name-or-id>                # close a tab
herd rename <name-or-id> <new-name>    # rename a tab
herd scrollback <tab-or-block> [n]    # read terminal output (default: 50 lines)
herd send <tab-or-block> [text]        # send input — arg, --file, or stdin pipe
herd config                            # show config and path
```

## Workflow: Checking What's Running

Before starting new sessions, always check what's already active:

```bash
herd sessions
```

Output example:
```
Sessions
==================================================

Workspace: work (current)

  [a1b2c3d4] "auth" ◄  ~/Dev/myapp
    ● active
  [e5f6a7b8] "api"  ~/Dev/myapp
    ○ idle
  [c9d0e1f2] "infra"  ~/Dev/myapp
      terminal
    last: $ git status
```

## Workflow: Opening a Session Batch

```bash
herd new auth ~/Dev/myapp
herd new api ~/Dev/myapp
herd new infra ~/Dev/myapp
```

Each tab is automatically named and the claude session name is synced to the tab title.

## Workflow: Resuming After Restart

```bash
herd sessions   # identify which tabs need resuming
herd resume auth ~/Dev/myapp
herd resume api ~/Dev/myapp
```

## Workflow: Forking a Session

Use `fork` when you want to explore an alternative approach without disrupting the original.
`herd fork` sends `/branch` to the source tab (Claude's built-in conversation fork command),
waits for the new session to be written, then opens it in a new tab.

```bash
herd fork auth                    # creates "auth-fork" tab
herd fork auth -n "auth-v2"       # creates "auth-v2" tab
```

The forked session shares full conversation history up to the branch point, then diverges independently.
If Claude does not respond to `/branch` in time, herd falls back to `claude --resume <id> --fork-session`.

**In-session equivalent**: typing `/branch` (alias `/fork`) directly in Claude produces the same fork —
use `herd resume <name> <dir>` afterwards to open the resulting session in a new tab.

## Workflow: Spawning a Parallel Agent

As a Claude Code session, you can spawn a sibling session to work on a parallel task:

**Preferred: pass the initial task directly to `herd new`** using `--prompt` or `--file`. This polls internally until Claude's `❯` prompt appears before sending — no race condition:

```bash
herd new payments ~/Dev/myapp --prompt "implement the billing endpoint"
herd new payments ~/Dev/myapp --file /tmp/task.txt
```

If you need to send a task after the fact, poll first:

```bash
herd new payments ~/Dev/myapp
# Poll until ❯ appears (typically 10-15s with MCP servers)
herd scrollback payments 5   # repeat until you see ❯
herd send payments --file /tmp/task.txt
herd send payments "yes\n"   # quick replies
```

**Do NOT call `herd send` immediately after `herd new`** — Claude is still starting up and the text will land as raw shell commands.

## Workflow: Monitoring Another Session

```bash
herd scrollback auth          # last 50 lines
herd scrollback auth 200      # last 200 lines
```

## Workflow: Sending Input to a Session

```bash
herd send auth "yes\n"        # approve a tool call
herd send auth "\n"           # press enter (confirm a prompt)
herd send auth "/clear\n"     # send a slash command
herd send auth --file ~/prompts/task.txt   # send a full prompt from file
echo "do the thing" | herd send auth       # pipe via stdin
```

## Workflow: Worktrees

**Always point tabs at the repo root — never at a manually-created worktree directory.** Claude Code manages worktrees itself via `claude --worktree <name>`, which creates `.claude/worktrees/<name>/` inside the repo and handles branch creation and cleanup automatically.

### New isolated session (new branch, Claude manages everything)

```bash
herd new feature-name ~/Dev/myapp --worktree
# Equivalent to: cd ~/Dev/myapp && claude --worktree "feature-name" --name "feature-name"
# Claude creates: ~/Dev/myapp/.claude/worktrees/feature-name/
# Claude creates branch: worktree-feature-name
```

### Existing branch — ask Claude to enter the worktree mid-session

```bash
herd new hiring ~/Dev/myapp          # open tab at repo root
herd send hiring "Enter a worktree for branch z.old/new-hire-ad and ..."
# Claude will use EnterWorktree tool to set up isolation
```

### Do NOT manage git worktrees manually

```bash
# ❌ WRONG — do not create worktree dirs yourself and pass them to herd new
git worktree add ~/Dev/myapp-feature branch
herd new feature ~/Dev/myapp-feature

# ✅ RIGHT — always use repo root; let Claude Code manage the worktree
herd new feature ~/Dev/myapp --worktree
```

**Why:** Manually created worktree dirs placed outside the repo confuse Claude Code's session tracking, project memory lookup (`.claude/` is in the main repo), and CLAUDE.md resolution. Claude Code's built-in worktree support keeps everything co-located under `.claude/worktrees/` and handles cleanup on session exit.

## Workflow: Cleanup

```bash
herd sessions                        # find idle/terminal tabs
herd close old-feature               # close by name (prefix match)
herd close e5f6a7b8                  # close by block ID prefix
```

## Tab Naming Conventions

Name tabs after the **project or task**:
- `auth` — authentication work
- `api` — API service
- `infra` — infrastructure
- `pr-1234` — specific PR work
- `auth-v2` — forked attempt

## Notes

- Tab names are matched by exact name or prefix (case-insensitive)
- Block IDs can be abbreviated to the first 8 characters
- `herd new` and `herd resume` automatically pass `--name <tab-name>` to claude, syncing the session display name with the tab title
- Configured `claude.flags` in `~/.config/herd/config.toml` are applied to every session
- `herd send` resolves tab names to their terminal block automatically
