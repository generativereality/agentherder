import { readdirSync, statSync, existsSync } from 'fs'
import { homedir } from 'os'
import { join, basename, extname } from 'path'
import { resolve } from 'path'

/** Convert an absolute path to Claude's project slug (/ → -) */
export function pathToProjectSlug(dir: string): string {
  return resolve(dir).replace(/\//g, '-')
}

/** Find the most recent Claude Code session ID for a directory */
export function findLatestSessionId(dir: string): string | null {
  const slug = pathToProjectSlug(dir)
  const projectDir = join(homedir(), '.claude', 'projects', slug)

  if (!existsSync(projectDir)) return null

  const jsonlFiles = readdirSync(projectDir)
    .filter((f) => extname(f) === '.jsonl')
    .map((f) => ({
      name: f,
      mtime: statSync(join(projectDir, f)).mtimeMs,
    }))
    .sort((a, b) => b.mtime - a.mtime)

  if (!jsonlFiles.length) return null
  return basename(jsonlFiles[0].name, '.jsonl')
}
