import { define } from 'gunshi'
import { consola } from 'consola'
import { requireWaveAdapter } from '../core/wave.js'

export const scrollbackCommand = define({
  name: 'scrollback',
  description: 'Show terminal output for a block (default: last 50 lines)',
  args: {
    block: { type: 'positional', description: 'Block ID prefix' },
    lines: { type: 'number', description: 'Number of lines to show', default: 50 },
  },
  async run(ctx) {
    const query = ctx.positionals[1]
    const lines = (ctx.values.lines as number | undefined) ?? 50
    if (!query) { consola.error('Block ID is required'); process.exit(1) }
    const adapter = requireWaveAdapter()
    const blocks = adapter.blocksList()
    const matches = adapter.resolveBlock(query, blocks)
    if (!matches.length) { consola.error(`No block matching '${query}'`); process.exit(1) }
    if (matches.length > 1) {
      consola.error(`Multiple blocks match '${query}':`)
      for (const b of matches) consola.log(`  ${b.blockid}`)
      process.exit(1)
    }
    process.stdout.write(adapter.scrollback(matches[0].blockid, lines))
  },
})
