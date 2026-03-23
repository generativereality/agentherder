import { define } from 'gunshi'
import { consola } from 'consola'
import { openSession } from '../core/open-session.js'

export const newCommand = define({
  name: 'new',
  description: 'Open a new tab and launch claude',
  args: {
    name: { type: 'positional', description: 'Tab name' },
    dir: { type: 'positional', description: 'Working directory / repo root (default: cwd)' },
    workspace: { type: 'string', short: 'w', description: 'Target workspace' },
    worktree: { type: 'boolean', short: 'W', description: 'Launch claude with --worktree <name> for isolated branch work' },
  },
  async run(ctx) {
    const name = ctx.positionals[1]
    const dir = ctx.positionals[2] ?? process.cwd()
    const workspace = ctx.values.workspace
    const useWorktree = ctx.values.worktree ?? false
    if (!name) { consola.error('Tab name is required'); process.exit(1) }
    const claudeCmd = useWorktree ? `claude --worktree ${JSON.stringify(name)}` : 'claude'
    const tabId = await openSession({ tabName: name, dir, claudeCmd, workspaceQuery: workspace })
    const suffix = useWorktree ? ` (worktree: .claude/worktrees/${name})` : ''
    consola.success(`Tab "${name}" [${tabId.slice(0, 8)}] → claude at ${dir}${suffix}`)
  },
})
