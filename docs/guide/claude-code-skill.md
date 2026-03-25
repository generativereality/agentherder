---
title: Claude Code Skill — Agent Herder
description: Let Claude Code orchestrate parallel sessions autonomously using the built-in herd skill. Spawn, fork, monitor, and send input across tabs.
---

# Claude Code Skill

The included skill lets Claude Code call `herd` itself — checking what sessions are running, spawning parallel agents, forking conversations, and sending input to coordinate across tabs.

## Install

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

This installs both the `herd` CLI and the skill. Updates are delivered via the plugin — run `/plugin update agentherder` to get the latest.

## What Claude can do with it

**Check what's running:**
```bash
herd sessions
```

**Spawn a parallel session and send it a task:**
```bash
herd new payments ~/Dev/myapp
herd send payments --file /tmp/task.txt
echo "implement the billing endpoint" | herd send payments
```

**Fork its own session to try an alternative approach:**
```bash
herd fork auth -n auth-v2
```

**Monitor a sibling session without switching to it:**
```bash
herd scrollback payments 100
```

**Approve a tool call in another session:**
```bash
herd send payments "yes\n"
```

## How it works

The skill (`SKILL.md`) is loaded into Claude Code's context when placed in `.claude/skills/herd/`. It gives Claude:

- The full command reference
- Workflow patterns for common multi-session tasks
- Tab naming conventions
- Auto-install logic for the CLI itself
