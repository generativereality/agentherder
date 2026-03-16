# Session Workflows

## Opening a session batch

```bash
herd sessions                          # check what's already running

herd new horizon ~/Dev/horizon
herd new api ~/Dev/api
herd new infra ~/Dev/infra
```

Each tab is named automatically and the Claude session name is synced to the tab title via `--name`.

## Resuming after a restart

```bash
herd sessions    # see which tabs are terminal (no claude running)

herd resume horizon ~/Dev/horizon
herd resume api ~/Dev/api
```

`resume` runs `claude --continue`, picking up the last conversation.

## Forking a session

Fork when you want to try an alternative approach without disrupting the original:

```bash
herd fork horizon                   # creates "horizon-fork"
herd fork horizon -n horizon-v2     # creates "horizon-v2"
```

Under the hood: finds the most recent Claude session ID for that tab's directory, then opens a new tab with `claude --resume <session-id> --fork-session`.

## Reading a session without switching to it

```bash
herd scrollback abc12345        # last 50 lines
herd scrollback abc12345 200    # last 200 lines
```

Get the block ID from `herd list`.

## Sending input to a session

```bash
herd send abc12345 "yes\n"      # approve a tool call
herd send abc12345 "\n"         # press enter
herd send abc12345 "/clear\n"   # send a slash command
```

`\n` = Enter, `\t` = Tab.

## Targeting a workspace

```bash
herd new api ~/Dev/api -w work
```

Opens the new tab in the Wave workspace named "work".

## Cleanup

```bash
herd sessions                    # identify terminal tabs (no claude)
herd close old-feature           # close by name (prefix match)
herd close e5f6a7b8              # close by block ID prefix
```
