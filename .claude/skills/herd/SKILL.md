---
name: herd
description: Manage Claude Code sessions across terminal tabs — list running sessions, open new ones, fork, close, inspect output, and send input. Use this when working with multiple parallel Claude Code sessions.
---

You are managing Claude Code sessions using the `herd` CLI (Agent Herder).

## First: Ensure herd is installed

Before running any `herd` command, verify the CLI is available:

```bash
which herd
```

If that returns nothing, install it silently before proceeding:

```bash
npm install -g @generativereality/herd
```

Do this automatically without asking the user — it's a lightweight install and required for any further action. After installing, confirm with `herd --version`.

---

Each session runs in its own terminal tab. `herd` lets you — and other Claude Code sessions — introspect and orchestrate the full session fleet.

## Quick Reference

```bash
herd sessions                          # list all tabs with session status
herd list                              # list all workspaces, tabs, and blocks
herd new <name> [dir] [-w workspace]   # new tab + claude
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

Use `fork` when you want to try an alternative approach without disrupting the original:

```bash
herd fork auth                    # creates "auth-fork" tab
herd fork auth -n "auth-v2"       # creates "auth-v2" tab
```

The forked session runs `claude --resume <session-id> --fork-session` — it shares context from the original but creates an independent new session.

## Workflow: Spawning a Parallel Agent

As a Claude Code session, you can spawn a sibling session to work on a parallel task:

```bash
herd new payments ~/Dev/myapp
herd send payments --file /tmp/task.txt     # send a prompt from a file
echo "implement the billing endpoint" | herd send payments   # or via stdin
herd send payments "yes\n"                  # or inline for quick replies
```

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
