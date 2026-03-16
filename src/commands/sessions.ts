import { define } from 'gunshi'
import { requireWaveAdapter } from '../core/wave.js'
import type { SessionStatus } from '../types/index.js'

export const sessionsCommand = define({
  name: 'sessions',
  description: 'List tabs with active/idle session status',
  args: {},
  async run() {
    const adapter = requireWaveAdapter()
    const { tabsById, workspaces, tabNames } = await adapter.getAllData()
    const currentTab = process.env.WAVETERM_TABID ?? ''
    const currentWs = process.env.WAVETERM_WORKSPACEID ?? ''

    console.log('Sessions')
    console.log('='.repeat(50))

    for (const wsp of workspaces) {
      const { oid, name, tabids } = wsp.workspacedata
      const wsMarker = oid === currentWs ? ' (current)' : ''
      const tabIds = tabids.filter((t) => tabsById.has(t))
      if (!tabIds.length) continue

      console.log(`\nWorkspace: ${name}${wsMarker}`)

      for (const tabId of tabIds) {
        const termBlocks = (tabsById.get(tabId) ?? []).filter((b) => b.view === 'term')
        if (!termBlocks.length) continue

        const name = tabNames.get(tabId) ?? tabId.slice(0, 8)
        const cur = tabId === currentTab ? ' ◄' : ''
        const b = termBlocks[0]
        const cwd = (b.meta?.['cmd:cwd'] ?? '').replace(process.env.HOME ?? '', '~')

        const tail = adapter.scrollback(b.blockid, 5)
        const tailLines = tail.split('\n').map((l) => l.trim()).filter(Boolean)
        const lastLine = tailLines.at(-1) ?? ''

        let status: SessionStatus = 'terminal'
        if (
          ['Claude Code', 'claude.ai/code', '✻ Thinking', '✽ Hatching', '⏵⏵ bypass'].some(
            (s) => tail.includes(s),
          )
        ) {
          status = 'active'
        } else if (lastLine.toLowerCase().includes('claude')) {
          status = 'idle'
        }

        const statusLabel =
          status === 'active' ? '● active' : status === 'idle' ? '○ idle' : '  terminal'

        console.log(`  [${tabId.slice(0, 8)}] "${name}"${cur}  ${cwd}`)
        console.log(`    ${statusLabel}`)
        if (status === 'terminal' && lastLine) {
          console.log(`    last: ${lastLine.slice(0, 80)}`)
        }
      }
    }
  },
})
