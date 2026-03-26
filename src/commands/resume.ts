import { resolve } from 'path'
import { homedir } from 'os'
import { define } from 'gunshi'
import { consola } from 'consola'
import { select } from '@clack/prompts'
import { loadConfig } from '../core/config.js'
import { requireWaveAdapter } from '../core/wave.js'
import { openSession } from '../core/open-session.js'
import { findSessionsByName, findLatestSessionId, pathToProjectSlug } from '../core/session.js'

function formatAge(mtimeMs: number): string {
  const mins = Math.round((Date.now() - mtimeMs) / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.round(hours / 24)}d ago`
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

export const resumeCommand = define({
  name: 'resume',
  description: 'Resume a claude session by name — reuses existing tab or creates a new one',
  args: {
    name: { type: 'positional', description: 'Tab / session name' },
    dir: { type: 'positional', description: 'Working directory (default: cwd)' },
  },
  async run(ctx) {
    const name = ctx.positionals[1]
    const dir = resolve((ctx.positionals[2] ?? process.cwd()).replace(/^~/, homedir()))
    if (!name) { consola.error('Tab name is required'); process.exit(1) }

    // Find sessions matching the name
    const sessions = findSessionsByName(dir, name)
    let sessionId: string | undefined

    if (sessions.length === 0) {
      // Fall back to latest session in dir
      sessionId = findLatestSessionId(dir) ?? undefined
      if (!sessionId) {
        consola.error(`No Claude session found for "${name}" in ${dir}`)
        consola.info(`Looked in ~/.claude/projects/${pathToProjectSlug(dir)}/`)
        process.exit(1)
      }
      consola.warn(`No session named "${name}" — using latest session ${sessionId.slice(0, 8)}…`)
    } else if (sessions.length === 1) {
      sessionId = sessions[0].id
    } else {
      // Multiple sessions — show picker
      const picked = await select({
        message: `Multiple "${name}" sessions found — pick one:`,
        options: sessions.map((s) => ({
          value: s.id,
          label: `${s.id.slice(0, 8)}…  ${formatAge(s.mtime)}  ${formatSize(s.size)}`,
        })),
      })
      if (typeof picked !== 'string') { process.exit(0) }
      sessionId = picked
    }

    const adapter = requireWaveAdapter()
    const { tabsById, tabNames } = await adapter.getAllData()
    const matchingTabs = adapter.resolveTab(name, tabsById, tabNames)

    if (matchingTabs.length > 1) {
      consola.error(`Multiple tabs match '${name}':`)
      for (const tid of matchingTabs) {
        consola.error(`  "${tabNames.get(tid)}"  [${tid.slice(0, 8)}]`)
      }
      process.exit(1)
    }

    if (matchingTabs.length === 1) {
      // Reuse existing tab
      const tabId = matchingTabs[0]
      const blocks = tabsById.get(tabId) ?? []
      const termBlock = blocks.find((b) => b.view === 'term')
      if (!termBlock) {
        consola.error(`No terminal block found in tab '${name}'`)
        process.exit(1)
      }

      const config = loadConfig()
      const extraFlags = config.claude.flags.join(' ')
      const cmd = `cd ${JSON.stringify(dir)} && claude${extraFlags ? ' ' + extraFlags : ''} --resume ${sessionId} --name ${JSON.stringify(name)}\r`
      await adapter.sendInput(termBlock.blockid, cmd)
      adapter.closeSocket()
      consola.success(`Tab "${name}" [${tabId.slice(0, 8)}] → claude --resume ${sessionId!.slice(0, 8)}… at ${dir}`)
    } else {
      // No existing tab — create one
      adapter.closeSocket()
      const tabId = await openSession({
        tabName: name,
        dir,
        claudeCmd: `claude --resume ${sessionId} --name ${JSON.stringify(name)}`,
      })
      consola.success(`Tab "${name}" [${tabId.slice(0, 8)}] → claude --resume ${sessionId!.slice(0, 8)}… at ${dir} (new tab)`)
    }
  },
})
