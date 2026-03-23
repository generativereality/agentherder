import { readdirSync, statSync, existsSync } from 'fs'
import { homedir } from 'os'
import { join, basename, extname } from 'path'
import { resolve } from 'path'

/** Convert an absolute path to Claude's project slug (/ → -) */
export function pathToProjectSlug(dir: string): string {
  return resolve(dir).replace(/\//g, '-')
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

/** Return the directory hint for the session lookup (for error messages) */
export function pathToProjectSlugHint(dir: string): string {
  return pathToProjectSlug(dir)
}
