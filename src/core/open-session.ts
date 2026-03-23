import { resolve } from 'path'
import { existsSync, readFileSync } from 'fs'
import { homedir } from 'os'
import { consola } from 'consola'
import { loadConfig } from './config.js'
import { requireWaveAdapter } from './wave.js'

interface OpenSessionOptions {
  tabName: string
  dir: string
  claudeCmd: string // e.g. "claude", "claude --continue", "claude --resume <id> --fork-session"
  workspaceQuery?: string
  /** If set, poll for Claude's ready prompt then send this file's content as the initial task */
  initialPromptFile?: string
}

/** Poll scrollback until Claude's ❯ prompt is visible, then return */
async function waitForClaudePrompt(adapter: ReturnType<typeof requireWaveAdapter>, blockId: string, timeoutMs = 30_000): Promise<void> {
  const POLL_INTERVAL = 1000
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL))
    try {
      const lines = adapter.scrollback(blockId, 10)
      // Claude's ready prompt contains the ❯ character
      if (lines && lines.includes('❯')) return
    } catch {
      // scrollback not yet available — keep polling
    }
  }
  consola.warn('Timed out waiting for Claude prompt — sending task anyway')
}

export async function openSession(opts: OpenSessionOptions): Promise<string> {
  const { tabName, claudeCmd, workspaceQuery, initialPromptFile } = opts
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

  if (initialPromptFile) {
    // Poll until Claude's ready prompt appears, then send the initial task
    await waitForClaudePrompt(adapter, blockId)
    const prompt = readFileSync(initialPromptFile, 'utf-8')
    const text = prompt.endsWith('\n') ? prompt : prompt + '\n'
    await adapter.sendInput(blockId, text)
  }

  // Wait for Wave to fully process the new tab before returning, so rapid
  // back-to-back `herd new` calls don't race on waitForNewBlock.
  await new Promise((r) => setTimeout(r, 2000))

  adapter.closeSocket()

  return tabId
}
