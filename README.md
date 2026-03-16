# herd

**Agent session manager for AI coding tools.**

The terminal tab IS the UI. No tmux, no dashboards — just your terminal tabs, each running a focused Claude Code session, orchestrated by a simple CLI that Claude Code itself can call.

```
herd sessions      # what's running
herd new auth ~/Dev/myapp
herd fork auth -n auth-v2
herd send abc123 "approve\n"
```

→ [agentherder.com](https://agentherder.com)

---

## Why herd

Most multi-session tools either wrap tmux (awkward scrolling, copy-paste friction) or build a TUI on top of your terminal (another UI layer you didn't ask for).

herd takes a different approach: **your terminal tabs are already the multiplexer**. herd just gives you a CLI to drive them — open tabs, name them, fork sessions, read their output, send input — with Claude Code sessions as first-class citizens.

The key insight: Claude Code's `-n/--name` flag already syncs the session name to the terminal tab title. herd builds on this to keep tab names, session names, and project directories in sync automatically.

## Features

- **Session-aware tab management** — open, resume, fork, close, rename tabs by name
- **Fork sessions** — branch an existing conversation into a new independent tab
- **Claude Code skill included** — Claude can call `herd` itself to orchestrate parallel work
- **Config-driven defaults** — set flags like `--dangerously-skip-permissions` once
- **Tab name = session name** — always in sync via `--name`
- **Workspace-aware** — target specific Wave workspaces with `-w`
- **Scriptable** — plain CLI, composable in hooks and automation

## Install

```bash
npm install -g @generativereality/herd
```

**Requirements:** Wave Terminal · macOS · Node.js 20+

**One-time setup:** Wave Terminal needs Accessibility permission:
System Settings → Privacy & Security → Accessibility → Wave Terminal ✓

## Usage

```
herd sessions                         List tabs with active/idle session status
herd list                             List all workspaces, tabs, and blocks
herd new <name> [dir] [-w workspace]  Open new tab, launch claude
herd resume <name> [dir]              Open new tab, run: claude --continue
herd fork <tab-name> [-n new-name]    Fork a session into a new tab
herd close <name-or-id>               Close a tab
herd rename <tab> <new-name>          Rename a tab
herd scrollback <tab-or-block> [n]   Read terminal output (default: 50 lines)
herd send <tab-or-block> [text]       Send input — text arg, --file, or stdin
herd config                           Show config file path and current values
```

### Spin up parallel sessions

```bash
herd sessions                          # see what's already active

herd new auth ~/Dev/myapp
herd new api ~/Dev/myapp
herd new infra ~/Dev/myapp
```

### Fork a session

```bash
# Try an alternative approach without disrupting the original
herd fork auth -n auth-attempt2
```

Runs `claude --resume <session-id> --fork-session` in a new tab — shares context from the source session but creates an independent conversation.

### Read and send

```bash
# Check what's happening in a session without switching to it
herd scrollback auth
herd scrollback auth 200

# Send a prompt from a file
herd send auth --file ~/prompts/task.txt

# Pipe a prompt via stdin
echo "please review this PR" | herd send auth

# Send a quick reply
herd send auth "yes\n"

# Send a slash command
herd send auth "/clear\n"
```

### Target a workspace

```bash
herd new api ~/Dev/myapp -w work
```

## Config

```toml
# ~/.config/herd/config.toml

[claude]
# Extra flags passed to every `claude` invocation.
flags = ["--allow-dangerously-skip-permissions"]

[defaults]
# Default Wave workspace for new sessions.
# workspace = ""
```

## Claude Code Skill

Install the skill so Claude Code itself can manage sessions:

```bash
mkdir -p .claude/skills/herd
curl -fsSL https://raw.githubusercontent.com/generativereality/agentherder/main/.claude/skills/herd/SKILL.md \
  -o .claude/skills/herd/SKILL.md
```

With the skill installed, Claude can:
- Check what sessions are running (`herd sessions`)
- Spawn parallel sessions for independent tasks (`herd new api ~/Dev/myapp`)
- Fork its own session to try alternative approaches (`herd fork auth`)
- Monitor sibling sessions (`herd scrollback auth`)
- Send input to coordinate across sessions (`herd send auth "approve\n"`)

## Terminal Support

| Terminal | Status |
|----------|--------|
| Wave Terminal | ✅ Full support |
| iTerm2 | Planned |
| Ghostty | Planned |
| Warp | Planned |

herd auto-detects the terminal from environment variables. Wave Terminal is supported today via unix socket RPC. Other terminals will be added as adapters — contributions welcome.

## Comparison

| | herd | claude-squad | ccmanager | agent-deck |
|---|---|---|---|---|
| No tmux required | ✅ | ❌ | ❌ | ❌ |
| Terminal tabs as UI | ✅ | ❌ | ❌ | ❌ |
| Claude Code skill | ✅ | ❌ | ❌ | ❌ |
| Fork sessions | ✅ | ❌ | ❌ | ❌ |
| Tab title sync | ✅ | ❌ | ❌ | ❌ |
| Lightweight CLI | ✅ | ❌ | ✅ | ❌ |

## License

MIT
