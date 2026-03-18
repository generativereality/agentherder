# Session Workflows

## Opening a session batch

```bash
herd sessions                          # check what's already running

herd new auth ~/Dev/myapp
herd new api ~/Dev/myapp
herd new infra ~/Dev/myapp
```

Each tab is named automatically and the Claude session name is synced to the tab title via `--name`.

## Resuming after a restart

```bash
herd sessions    # see which tabs are terminal (no claude running)

herd resume auth ~/Dev/myapp
herd resume api ~/Dev/myapp
```

`resume` runs `claude --continue`, picking up the last conversation.

## Forking a session

Fork when you want to try an alternative approach without disrupting the original:

```bash
herd fork auth                   # creates "auth-fork"
herd fork auth -n auth-v2        # creates "auth-v2"
```

Under the hood: finds the most recent Claude session ID for that tab's directory, then opens a new tab with `claude --resume <session-id> --fork-session`.

## Reading a session without switching to it

```bash
herd scrollback auth          # last 50 lines (by tab name)
herd scrollback auth 200      # last 200 lines
herd scrollback abc12345      # by block ID prefix
```

## Sending input to a session

```bash
# By tab name (resolves to its terminal block automatically)
herd send auth "yes\n"           # approve a tool call
herd send auth "\n"              # press enter
herd send auth "/clear\n"        # send a slash command

# Send a full prompt from a file
herd send auth --file ~/prompts/task.txt

# Pipe via stdin
echo "please review this PR" | herd send auth
```

`\n` = Enter, `\t` = Tab.

## Targeting a workspace

```bash
herd new api ~/Dev/myapp -w work
```

Opens the new tab in the Wave workspace named "work".

## Cleanup

```bash
herd sessions                    # identify terminal tabs (no claude)
herd close old-feature           # close by name (prefix match)
herd close e5f6a7b8              # close by block ID prefix
```
