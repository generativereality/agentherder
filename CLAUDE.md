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
5. Users update via Claude Code: `/plugins` → Marketplaces → Update generativereality → update agentherder plugin

The `generativereality/plugins` marketplace uses npm source — it points to `@generativereality/agentherder` on npm. Skills, plugin.json, and version are all read from the npm package. No need to update the plugins repo on each release.

## Key files

- `src/index.ts` — CLI entry point
- `src/commands/` — subcommands (`new`, `fork`, `close`, `send`, etc.)
- `src/core/` — core logic (session management, Wave Terminal adapter)
- `skills/herd/SKILL.md` — Claude Code skill (bundled into npm package)
- `.claude-plugin/plugin.json` — plugin manifest (version must match `package.json`)
