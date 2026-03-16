# Configuration

Config file: `~/.config/herd/config.toml`

Created automatically on first run of `herd config`.

## Options

```toml
[claude]
# Extra flags passed to every `claude` invocation.
# flags = ["--dangerously-skip-permissions"]

[defaults]
# Default Wave workspace to open new sessions in.
# workspace = ""
```

## claude.flags

Flags appended to every `claude` command launched by `herd new`, `herd resume`, and `herd fork`.

Common values:

```toml
[claude]
flags = ["--dangerously-skip-permissions"]
```

```toml
[claude]
flags = ["--model", "sonnet", "--dangerously-skip-permissions"]
```

## defaults.workspace

If set, `herd new` will open tabs in this workspace by default (without needing `-w`).

```toml
[defaults]
workspace = "work"
```

## Check current config

```bash
herd config
```

Prints the config file path and current values.
