import { define } from 'gunshi'
import { consola } from 'consola'
import { openSession } from '../core/open-session.js'

export const resumeCommand = define({
  name: 'resume',
  description: 'Open a new tab and run: claude --continue',
  args: {
    name: { type: 'positional', description: 'Tab name' },
    dir: { type: 'positional', description: 'Working directory (default: cwd)' },
  },
  async run(ctx) {
    const name = ctx.positionals[1]
    const dir = ctx.positionals[2] ?? process.cwd()
    if (!name) { consola.error('Tab name is required'); process.exit(1) }
    const tabId = await openSession({ tabName: name, dir, claudeCmd: 'claude --continue' })
    consola.success(`Tab "${name}" [${tabId.slice(0, 8)}] → claude --continue at ${dir}`)
  },
})
