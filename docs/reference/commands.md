# Commands

## herd (default)

Running `herd` with no arguments is equivalent to `herd sessions`.

## herd sessions

List all tabs with session status.

```bash
herd sessions
```

Output:
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

Status values:
- `● active` — Claude Code UI detected in scrollback
- `○ idle` — `claude` in last line but no active UI
- `  terminal` — plain shell, no Claude running

## herd list

List all workspaces, tabs, and blocks with IDs.

```bash
herd list
```

## herd new

Open a new tab and launch `claude`.

```bash
herd new <name> [dir] [-w workspace]
```

| Argument | Description |
|----------|-------------|
| `name` | Tab name (required) |
| `dir` | Working directory (default: current) |
| `-w, --workspace` | Target Wave workspace |

## herd resume

Open a new tab and run `claude --continue`.

```bash
herd resume <name> [dir]
```

## herd fork

Fork a session into a new tab using `claude --resume <session-id> --fork-session`.

```bash
herd fork <tab-name> [-n new-name]
```

| Argument | Description |
|----------|-------------|
| `tab-name` | Source tab (name or ID prefix) |
| `-n, --name` | Name for the new tab (default: `<source>-fork`) |

## herd close

Close a tab by name or ID prefix.

```bash
herd close <name-or-id>
```

## herd rename

Rename a tab.

```bash
herd rename <name-or-id> <new-name>
```

## herd scrollback

Read terminal output for a tab or block.

```bash
herd scrollback <tab-or-block> [lines]
```

Default: last 50 lines. Accepts a tab name, tab ID prefix, or block ID prefix.

## herd send

Send input to a tab or terminal block.

```bash
herd send <tab-or-block> [text] [--file <path>]
```

| Source | Example |
|--------|---------|
| Inline text | `herd send auth "yes\n"` |
| File | `herd send auth --file ~/prompts/task.txt` |
| Stdin | `echo "do the thing" \| herd send auth` |

Escape sequences in inline text: `\n` = Enter, `\t` = Tab.

Accepts a tab name (resolves to its first terminal block), or a block ID prefix.

## herd config

Show the config file path and current values.

```bash
herd config
```
