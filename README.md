# Agent Herder

**Run a fleet of Claude Code sessions. From the CLI — or from Claude itself.**

CLI command: `herd` · Website: [agentherder.com](https://agentherder.com)

```bash
herd new auth ~/Dev/myapp       # new tab, claude starts
herd new api ~/Dev/myapp
herd new infra ~/Dev/myapp

herd sessions                   # what's running across all tabs
herd scrollback auth            # read what auth is doing without switching tabs
herd send api --file task.txt   # drop a prompt into any session
herd fork auth -n auth-v2       # branch a conversation, keep the original
```

No tmux. No dashboard. Your terminal tabs are the UI.

---

## The idea

When you're running multiple Claude Code sessions in parallel, you lose track fast. Which tab is working on what? Did it finish? Is it waiting for input?

herd solves this with a simple CLI that treats **terminal tabs as the unit of orchestration** — open them by name, read their output, send them prompts, fork them, close them. Everything stays in sync: the tab title, the Claude session name, and the working directory.

The killer feature: **Claude can run herd itself.** Install the skill and your Claude Code session can spawn parallel sibling sessions, monitor their output, and coordinate across them — without you switching tabs.

## Install

**As a Claude Code plugin** (recommended — installs the CLI + skill in one step):

Run these slash commands inside a [Claude Code](https://claude.ai/code) session:

```
❯ /plugin marketplace add generativereality/plugins
  ⎿  Successfully added marketplace: generativereality

❯ /plugin install agentherder@generativereality
  ⎿  ✓ Installed agentherder. Run /reload-plugins to activate.

❯ /reload-plugins
  ⎿  Reloaded: 1 plugin · 0 skills · 5 agents · 0 hooks · 0 plugin MCP servers · 0 plugin LSP servers
```

> **Note:** These are Claude Code slash commands, not shell commands. Type them at the `❯` prompt inside a Claude Code session.

**Via npm** (CLI only, no Claude Code skill):

```bash
npm install -g @generativereality/agentherder
```

**Skill only** (if you already have the CLI installed via npm):

```bash
mkdir -p .claude/skills/herd
curl -fsSL https://raw.githubusercontent.com/generativereality/agentherder/main/skills/herd/SKILL.md \
  -o .claude/skills/herd/SKILL.md
```

**Requirements:** [Wave Terminal](https://waveterm.dev) · macOS · Node.js 20+

**One-time:** Wave needs Accessibility permission — System Settings → Privacy & Security → Accessibility → Wave ✓

## Usage

```
herd sessions                          what's running (active/idle status)
herd list                              all workspaces, tabs, and blocks
herd new <name> [dir] [-w workspace]   open tab, start claude
herd resume <name> [dir]               open tab, run claude --continue
herd fork <tab> [-n new-name]          fork a session into a new tab
herd close <tab>                       close a tab
herd rename <tab> <new-name>           rename a tab
herd scrollback <tab> [lines]          read terminal output (default: 50 lines)
herd send <tab> [text]                 send input — arg, --file, or stdin pipe
herd config                            show config path and values
```

Tab names match by prefix. Block IDs can be shortened to 8 chars.

### Spin up a session fleet

```bash
herd sessions                 # check what's already running first

herd new auth ~/Dev/myapp
herd new payments ~/Dev/myapp
herd new infra ~/Dev/myapp
```

Each tab gets named, Claude's session name syncs to the tab title via `--name`.

### Send a prompt

```bash
# From a file (good for long context-heavy prompts)
herd send auth --file ~/prompts/task.txt

# Via stdin
echo "focus on the edge cases in the OAuth flow" | herd send auth

# Quick reply or approval
herd send auth "yes\n"
herd send auth "/clear\n"
```

### Check in without switching tabs

```bash
herd scrollback auth          # last 50 lines
herd scrollback auth 200      # last 200 lines
```

### Fork a session

```bash
# Try a different approach without losing the original conversation
herd fork auth -n auth-v2
```

Runs `claude --resume <id> --fork-session` — new independent session, full shared context from the original.

### Target a workspace

```bash
herd new api ~/Dev/myapp -w work
```

## Claude Code Skill

The real unlock: install the plugin (see [Install](#install)) so **Claude Code can herd itself**.

With the skill installed, Claude can:

- Check what's running before starting duplicate work (`herd sessions`)
- Spawn a parallel session for an independent subtask (`herd new payments ~/Dev/myapp`)
- Monitor siblings without interrupting them (`herd scrollback payments`)
- Drop a prompt into any session (`herd send payments --file spec.txt`)
- Fork its own session to explore an alternative approach (`herd fork auth`)

Claude becomes the orchestrator of its own fleet.

## Tip: pair with Claude Code Remote Control

Claude Code's [Remote Control](https://docs.anthropic.com/en/docs/claude-code/remote-control) lets you access a local session from any device — phone, tablet, browser — via `claude.ai/code`. The session still runs on your machine, with full filesystem and tool access.

Paired with Agent Herder, the pattern is:

1. Start a **command session** with Remote Control enabled:
   ```bash
   claude --remote-control "command"
   ```
2. From your phone or browser, connect to that session and assign work:
   > *"Spawn three sessions — auth, payments, infra — and start them on these tasks..."*
3. The command session uses `herd` to open tabs, send prompts, and check in on workers
4. You monitor and steer the whole fleet from your phone while the machine does the work

One remote-controlled session orchestrating a local fleet.

## Config

```toml
# ~/.config/herd/config.toml

[claude]
# Flags passed to every claude invocation
flags = ["--allow-dangerously-skip-permissions"]

[defaults]
# Default Wave workspace for new sessions
# workspace = ""
```

## Terminal support

| Terminal | Status |
|----------|--------|
| [Wave Terminal](https://waveterm.dev) | ✅ Full support |
| iTerm2 | Planned |
| Ghostty | Planned |
| Warp | Planned |

Wave is supported via its unix socket RPC. Other terminals will follow as adapters — PRs welcome.

## License

MIT
