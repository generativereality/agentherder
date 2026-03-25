# agentherder

Agent session manager for AI coding tools. Terminal tabs as the UI, no tmux.

## Release flow

1. Make changes in `src/`
2. Bump version in **both** `package.json` and `.claude-plugin/plugin.json` (keep in sync)
3. Publish to npm (requires an **Automation** token to bypass 2FA):
   ```bash
   npm publish --registry https://registry.npmjs.org --//registry.npmjs.org/:_authToken=<token>
   ```
4. Commit and push this repo
5. In `generativereality/plugins`: bump `plugins/agentherder/.claude-plugin/plugin.json` to match, **and sync `plugins/agentherder/skills/herd/SKILL.md`** if the skill changed, commit and push
6. Users update via Claude Code: `/plugins` → Marketplaces → Update generativereality → update agentherder plugin

**Important:** Claude Code loads skills from the marketplace repo, NOT from the npm package. The `skills/` directory must exist in both this repo and `generativereality/plugins`.

## Key files

- `src/index.ts` — CLI entry point
- `src/commands/` — subcommands (`new`, `fork`, `close`, `send`, etc.)
- `src/core/` — core logic (session management, Wave Terminal adapter)
- `skills/herd/SKILL.md` — Claude Code skill (must be synced to `generativereality/plugins`)
- `.claude-plugin/plugin.json` — plugin manifest (version must match `package.json`)
