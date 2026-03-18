# Claude Code Skill

The included skill lets Claude Code call `herd` itself — checking what sessions are running, spawning parallel agents, forking conversations, and sending input to coordinate across tabs.

## Install

**Via plugin** (recommended — also installs the CLI):

```bash
/plugin marketplace add generativereality/plugins
/plugin install agentherder@plugins
```

**Manually** (if you installed the CLI via npm):

```bash
mkdir -p .claude/skills/herd
curl -fsSL https://raw.githubusercontent.com/generativereality/agentherder/main/skills/herd/SKILL.md \
  -o .claude/skills/herd/SKILL.md
```

The skill auto-installs the `herd` CLI via npm if it's not already on your PATH.

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
