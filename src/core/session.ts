import { readdirSync, readFileSync, statSync, existsSync } from 'fs'
import { homedir } from 'os'
import { join, basename, extname } from 'path'
import { resolve } from 'path'

/** Convert an absolute path to Claude's project slug (/ and . → -) */
export function pathToProjectSlug(dir: string): string {
  return resolve(dir).replace(/[/.]/g, '-')
}

/** Find the most recent .jsonl session file in a Claude project directory */
function latestJsonlIn(projectDir: string): string | null {
  if (!existsSync(projectDir)) return null
  const files = readdirSync(projectDir)
    .filter((f) => extname(f) === '.jsonl')
    .map((f) => ({ name: f, mtime: statSync(join(projectDir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)
  return files.length ? basename(files[0].name, '.jsonl') : null
}

/**
 * Find the most recent Claude Code session ID for a directory.
 * Also checks worktree subdirectories (.claude/worktrees/*) since tabs
 * opened with --worktree run from a worktree path, not the repo root.
 */
export function findLatestSessionId(dir: string): string | null {
  const projectsRoot = join(homedir(), '.claude', 'projects')

  // 1. Direct match on the given dir
  const direct = latestJsonlIn(join(projectsRoot, pathToProjectSlug(dir)))
  if (direct) return direct

  // 2. Check worktrees under dir: dir/.claude/worktrees/<name>
  const worktreesDir = join(dir, '.claude', 'worktrees')
  if (existsSync(worktreesDir)) {
    const candidates: Array<{ id: string; mtime: number }> = []
    for (const entry of readdirSync(worktreesDir)) {
      const worktreePath = join(worktreesDir, entry)
      const slug = pathToProjectSlug(worktreePath)
      const projectDir = join(projectsRoot, slug)
      const id = latestJsonlIn(projectDir)
      if (id) {
        const mtime = statSync(join(projectDir, id + '.jsonl')).mtimeMs
        candidates.push({ id, mtime })
      }
    }
    if (candidates.length) {
      candidates.sort((a, b) => b.mtime - a.mtime)
      return candidates[0].id
    }
  }

  return null
}

export interface SessionMatch {
  id: string
  mtime: number
  size: number
}

/**
 * Find all sessions with a given custom title (--name).
 * Returns them sorted by most recent first.
 */
export function findSessionsByName(dir: string, name: string): SessionMatch[] {
  const projectsRoot = join(homedir(), '.claude', 'projects')
  const projectDir = join(projectsRoot, pathToProjectSlug(dir))
  if (!existsSync(projectDir)) return []

  const matches: SessionMatch[] = []
  const files = readdirSync(projectDir).filter((f) => extname(f) === '.jsonl')

  for (const f of files) {
    const fullPath = join(projectDir, f)
    try {
      const content = readFileSync(fullPath, 'utf-8')
      if (content.includes(`"customTitle":"${name}"`) || content.includes(`"customTitle": "${name}"`)) {
        const stat = statSync(fullPath)
        matches.push({ id: basename(f, '.jsonl'), mtime: stat.mtimeMs, size: stat.size })
      }
    } catch {
      // skip unreadable files
    }
  }

  return matches.sort((a, b) => b.mtime - a.mtime)
}

/**
 * Find the most recently created session ID after a given timestamp.
 * Used by `herd fork` to detect the session Claude created in response to /branch.
 */
export function findNewestSessionIdSince(
  dir: string,
  sinceMs: number,
): string | null {
  const projectsRoot = join(homedir(), '.claude', 'projects')

  const candidates: Array<{ id: string; mtime: number }> = []

  function scanProjectDir(projectDir: string) {
    if (!existsSync(projectDir)) return
    for (const f of readdirSync(projectDir)) {
      if (extname(f) !== '.jsonl') continue
      const mtime = statSync(join(projectDir, f)).mtimeMs
      if (mtime > sinceMs) {
        candidates.push({ id: basename(f, '.jsonl'), mtime })
      }
    }
  }

  // Scan direct project dir
  scanProjectDir(join(projectsRoot, pathToProjectSlug(dir)))

  // Scan worktrees under dir
  const worktreesDir = join(dir, '.claude', 'worktrees')
  if (existsSync(worktreesDir)) {
    for (const entry of readdirSync(worktreesDir)) {
      scanProjectDir(join(projectsRoot, pathToProjectSlug(join(worktreesDir, entry))))
    }
  }

  if (!candidates.length) return null
  candidates.sort((a, b) => b.mtime - a.mtime)
  return candidates[0].id
}
