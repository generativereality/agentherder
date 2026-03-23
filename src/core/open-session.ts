import { resolve } from 'path'
import { existsSync } from 'fs'
import { homedir } from 'os'
import { consola } from 'consola'
import { loadConfig } from './config.js'
import { requireWaveAdapter } from './wave.js'

interface OpenSessionOptions {
  tabName: string
  dir: string
  claudeCmd: string // e.g. "claude", "claude --continue", "claude --resume <id> --fork-session"
  workspaceQuery?: string
}

export async function openSession(opts: OpenSessionOptions): Promise<string> {
  const { tabName, claudeCmd, workspaceQuery } = opts
  const dir = resolve(opts.dir.replace(/^~/, homedir()))

  if (!existsSync(dir)) {
    consola.error(`Directory does not exist: ${dir}`)
    process.exit(1)
  }

  const config = loadConfig()

  const adapter = requireWaveAdapter()

  let focusWindowId: string | undefined

  if (workspaceQuery) {
    const { workspaces } = await adapter.getAllData()
    const matches = adapter.resolveWorkspace(workspaces, workspaceQuery)
    if (!matches.length) {
      consola.error(`No workspace matching '${workspaceQuery}'`)
      process.exit(1)
    }
    const { data, windowId } = matches[0]
    if (!windowId) {
      consola.error(`Workspace '${data.name}' has no open window`)
      process.exit(1)
    }
    focusWindowId = windowId
    consola.info(`Workspace: ${data.name}`)
  }

  const beforeIds = new Set(
    adapter.blocksList().filter((b) => b.view === 'term').map((b) => b.blockid),
  )

  await adapter.newTab(focusWindowId)

  const result = await adapter.waitForNewBlock(beforeIds)
  if (!result) {
    consola.error('Timed out waiting for new terminal block')
    process.exit(1)
  }

  const { blockId, tabId } = result
  await adapter.renameTab(tabId, tabName)

  const extraFlags = config.claude.flags.join(' ')
  const cmd = `cd ${JSON.stringify(dir)} && ${claudeCmd} --name ${JSON.stringify(tabName)}${extraFlags ? ' ' + extraFlags : ''}\n`
  await adapter.sendInput(blockId, cmd)
  adapter.closeSocket()

  return tabId
}
