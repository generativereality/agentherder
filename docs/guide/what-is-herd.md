# What is herd?

herd is a session manager for AI coding tools — primarily Claude Code. It lets you open, resume, fork, inspect, and close terminal sessions from a single CLI, without tmux.

## The problem

Running multiple Claude Code sessions in parallel is powerful, but the tooling around it is rough:

- **tmux-based tools** (claude-squad, agent-deck, ccmanager) wrap everything in panes. Scrolling is awkward. Copy-paste breaks. You're fighting tmux instead of using your terminal.
- **Manual tab management** works but has no memory — you lose track of which tab is which session, which directory it's in, and whether it's still active.
- **Claude Code's own session names** (`--name`) already sync to terminal tab titles, but nothing automates this.

## The approach

herd takes a different view: **your terminal tabs are already the multiplexer**. A tab per session is the right UI. herd just gives you a CLI to drive it:

```bash
herd sessions        # what's running right now
herd new api ~/Dev/api
herd fork horizon    # branch this conversation
herd send abc123 "yes\n"
```

## What makes it different

| | herd | claude-squad | ccmanager | agent-deck |
|---|---|---|---|---|
| No tmux required | ✅ | ❌ | ❌ | ❌ |
| Terminal tabs as UI | ✅ | ❌ | ❌ | ❌ |
| Fork sessions | ✅ | ❌ | ❌ | ❌ |
| Tab title sync | ✅ | ❌ | ❌ | ❌ |
| Claude Code skill | ✅ | ❌ | ❌ | ❌ |

## Terminal support

Wave Terminal is supported today. Support for iTerm2, Ghostty, and Warp is planned — the adapter architecture is in place.
