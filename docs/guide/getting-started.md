# Getting Started

## Prerequisites

- [Wave Terminal](https://waveterm.dev) (macOS)
- [Claude Code](https://claude.ai/code) — `claude` on your PATH
- Node.js ≥ 20

**One-time setup:** Wave Terminal needs Accessibility permission to open new tabs:

> System Settings → Privacy & Security → Accessibility → Wave Terminal ✓

## Install

```bash
npm install -g @generativereality/agentherder
```

Or with bun:

```bash
bun install -g @generativereality/agentherder
```

Verify:

```bash
herd --version
```

## First session

From inside Wave Terminal:

```bash
herd sessions
```

This shows all open tabs and whether they have active Claude Code sessions.

Open a new session:

```bash
herd new myproject ~/Dev/myproject
```

herd will:
1. Open a new Wave tab
2. Rename it to `myproject`
3. `cd` to `~/Dev/myproject`
4. Launch `claude --name myproject`

The tab title and Claude session name are in sync from the start.

## Add the Claude Code skill

Copy the skill into your project so Claude can use herd itself:

```bash
mkdir -p .claude/skills/herd
curl -fsSL https://raw.githubusercontent.com/generativereality/agentherder/main/.claude/skills/herd/SKILL.md \
  -o .claude/skills/herd/SKILL.md
```

Now Claude Code can call `herd sessions`, `herd new`, `herd fork`, and more to orchestrate parallel work.
