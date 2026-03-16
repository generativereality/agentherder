import { define } from 'gunshi'
import { consola } from 'consola'
import { requireWaveAdapter } from '../core/wave.js'
import { findLatestSessionId, pathToProjectSlug } from '../core/session.js'
import { openSession } from '../core/open-session.js'

export const forkCommand = define({
  name: 'fork',
  description: 'Fork a session into a new tab (claude --resume <id> --fork-session)',
  args: {
    tab: { type: 'positional', description: 'Source tab name or ID prefix' },
    name: { type: 'string', short: 'n', description: 'Name for the new tab' },
  },
  async run(ctx) {
    const sourceQuery = ctx.positionals[1]
    const customName = ctx.values.name
    if (!sourceQuery) { consola.error('Source tab name is required'); process.exit(1) }

    const adapter = requireWaveAdapter()
    const { tabsById, tabNames } = await adapter.getAllData()
    const matches = adapter.resolveTab(sourceQuery, tabsById, tabNames)

    if (!matches.length) { consola.error(`No tab matching '${sourceQuery}'`); process.exit(1) }
    if (matches.length > 1) {
      consola.error(`Multiple tabs match '${sourceQuery}':`)
      for (const tid of matches) consola.log(`  "${tabNames.get(tid)}"  [${tid.slice(0, 8)}]`)
      process.exit(1)
    }

    const tabId = matches[0]
    const tabName = tabNames.get(tabId) ?? tabId.slice(0, 8)
    const newName = customName ?? `${tabName}-fork`
    const termBlocks = (tabsById.get(tabId) ?? []).filter((b) => b.view === 'term')
    if (!termBlocks.length) { consola.error(`Tab "${tabName}" has no terminal block`); process.exit(1) }

    const sourceDir = termBlocks[0].meta?.['cmd:cwd'] ?? process.cwd()
    const sessionId = findLatestSessionId(sourceDir)
    if (!sessionId) {
      consola.error(`No Claude session found for ${sourceDir}`)
      consola.info(`Looked in ~/.claude/projects/${pathToProjectSlug(sourceDir)}/`)
      process.exit(1)
    }

    const newTabId = await openSession({
      tabName: newName,
      dir: sourceDir,
      claudeCmd: `claude --resume ${sessionId} --fork-session`,
    })
    consola.success(`Forked "${tabName}" → "${newName}" [${newTabId.slice(0, 8)}]`)
    consola.info(`session: ${sessionId}`)
  },
})
