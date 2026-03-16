import { define } from 'gunshi'
import { consola } from 'consola'
import { openSession } from '../core/open-session.js'

export const newCommand = define({
  name: 'new',
  description: 'Open a new tab and launch claude',
  args: {
    name: { type: 'positional', description: 'Tab name' },
    dir: { type: 'positional', description: 'Working directory (default: cwd)' },
    workspace: { type: 'string', short: 'w', description: 'Target workspace' },
  },
  async run(ctx) {
    const name = ctx.positionals[1]
    const dir = ctx.positionals[2] ?? process.cwd()
    const workspace = ctx.values.workspace
    if (!name) { consola.error('Tab name is required'); process.exit(1) }
    const tabId = await openSession({ tabName: name, dir, claudeCmd: 'claude', workspaceQuery: workspace })
    consola.success(`Tab "${name}" [${tabId.slice(0, 8)}] → claude at ${dir}`)
  },
})
