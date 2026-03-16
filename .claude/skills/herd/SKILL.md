---
name: herd
description: Manage Claude Code sessions across terminal tabs — list running sessions, open new ones, fork, close, inspect output, and send input. Use this when working with multiple parallel Claude Code sessions.
---

You are managing Claude Code sessions using the `herd` CLI.

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
herd scrollback <block-id> [lines]     # read terminal output (default: 50 lines)
herd send <block-id> <text>            # send input (\n = enter, \t = tab)
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

  [a1b2c3d4] "horizon" ◄  ~/Dev/horizon
    ● active
  [e5f6a7b8] "api"  ~/Dev/api
    ○ idle
  [c9d0e1f2] "infra"  ~/Dev/infra
      terminal
    last: $ git status
```

## Workflow: Opening a Session Batch

```bash
herd new horizon ~/Dev/horizon
herd new api ~/Dev/api
herd new infra ~/Dev/infra
```

Each tab is automatically named and the claude session name is synced to the tab title.

## Workflow: Resuming After Restart

```bash
herd sessions   # identify which tabs need resuming
herd resume horizon ~/Dev/horizon
herd resume api ~/Dev/api
```

## Workflow: Forking a Session

Use `fork` when you want to try an alternative approach without disrupting the original:

```bash
herd fork horizon                    # creates "horizon-fork" tab
herd fork horizon -n "horizon-v2"   # creates "horizon-v2" tab
```

The forked session runs `claude --resume <session-id> --fork-session` — it shares context from the original but creates an independent new session.

## Workflow: Spawning a Parallel Agent

As a Claude Code session, you can spawn a sibling session to work on a parallel task:

```bash
# Spawn a parallel session to work on the API while you work on the frontend
herd new api-work ~/Dev/horizon
# Then send it a prompt
herd send <block-id> "implement the new billing endpoint per the spec in docs/api.md\n"
```

## Workflow: Monitoring Another Session

```bash
herd scrollback <block-id>          # last 50 lines
herd scrollback <block-id> 200      # last 200 lines
```

## Workflow: Sending Input to a Session

```bash
herd send <block-id> "yes\n"        # approve a tool call
herd send <block-id> "\n"           # press enter (confirm a prompt)
herd send <block-id> "/clear\n"     # send a slash command
```

## Workflow: Cleanup

```bash
herd sessions                        # find idle/terminal tabs
herd close old-feature               # close by name (prefix match)
herd close e5f6a7b8                  # close by block ID prefix
```

## Tab Naming Conventions

Name tabs after the **project or task**:
- `horizon` — main app
- `api` — API service
- `infra` — infrastructure
- `pr-1234` — specific PR work
- `horizon-v2` — forked attempt

## Notes

- Tab names are matched by exact name or prefix (case-insensitive)
- Block IDs can be abbreviated to the first 8 characters
- `herd new` and `herd resume` automatically pass `--name <tab-name>` to claude, syncing the session display name with the tab title
- Configured `claude.flags` in `~/.config/herd/config.toml` are applied to every session
