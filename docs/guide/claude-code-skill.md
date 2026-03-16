# Claude Code Skill

The included skill lets Claude Code call `herd` itself — checking what sessions are running, spawning parallel agents, forking conversations, and sending input to coordinate across tabs.

## Install

```bash
mkdir -p .claude/skills/herd
curl -fsSL https://raw.githubusercontent.com/generativereality/agentherder/main/.claude/skills/herd/SKILL.md \
  -o .claude/skills/herd/SKILL.md
```

## What Claude can do with it

**Check what's running:**
```
herd sessions
```

**Spawn a parallel session for an independent task:**
```
herd new api-work ~/Dev/horizon
herd send <block-id> "implement the billing endpoint per docs/api.md\n"
```

**Fork its own session to try an alternative approach:**
```
herd fork horizon -n horizon-attempt2
```

**Monitor a sibling session without switching to it:**
```
herd scrollback <block-id> 100
```

**Approve a tool call in another session:**
```
herd send <block-id> "yes\n"
```

## How it works

The skill (`SKILL.md`) is loaded into Claude Code's context when placed in `.claude/skills/herd/`. It gives Claude:

- The full command reference
- Workflow patterns for common multi-session tasks
- Tab naming conventions
- Notes on what `herd` can and can't do
