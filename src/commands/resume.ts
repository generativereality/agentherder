import { resolve } from 'path'
import { homedir } from 'os'
import { define } from 'gunshi'
import { consola } from 'consola'
import { loadConfig } from '../core/config.js'
import { requireWaveAdapter } from '../core/wave.js'

export const resumeCommand = define({
  name: 'resume',
  description: 'Resume claude in an existing terminal tab',
  args: {
    name: { type: 'positional', description: 'Tab name' },
    dir: { type: 'positional', description: 'Working directory (default: cwd)' },
  },
  async run(ctx) {
    const name = ctx.positionals[1]
    const dir = resolve((ctx.positionals[2] ?? process.cwd()).replace(/^~/, homedir()))
    if (!name) { consola.error('Tab name is required'); process.exit(1) }

    const adapter = requireWaveAdapter()
    const { tabsById, tabNames } = await adapter.getAllData()
    const matchingTabs = adapter.resolveTab(name, tabsById, tabNames)

    if (!matchingTabs.length) {
      consola.error(`No tab matching '${name}'`)
      process.exit(1)
    }
    if (matchingTabs.length > 1) {
      consola.error(`Multiple tabs match '${name}':`)
      for (const tid of matchingTabs) {
        consola.error(`  "${tabNames.get(tid)}"  [${tid.slice(0, 8)}]`)
      }
      process.exit(1)
    }

    const tabId = matchingTabs[0]
    const blocks = tabsById.get(tabId) ?? []
    const termBlock = blocks.find((b) => b.view === 'term')
    if (!termBlock) {
      consola.error(`No terminal block found in tab '${name}'`)
      process.exit(1)
    }

    const config = loadConfig()
    const extraFlags = config.claude.flags.join(' ')
    const cmd = `cd ${JSON.stringify(dir)} && claude --continue --name ${JSON.stringify(name)}${extraFlags ? ' ' + extraFlags : ''}\n`
    await adapter.sendInput(termBlock.blockid, cmd)

    adapter.closeSocket()
    consola.success(`Tab "${name}" [${tabId.slice(0, 8)}] → claude --continue at ${dir}`)
  },
})
