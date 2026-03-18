import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Agent Herder',
  description: 'Run a fleet of Claude Code sessions. Terminal tabs as the UI, no tmux. CLI is herd.',
  lang: 'en-US',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'og:title', content: 'Agent Herder — run a fleet of Claude Code sessions' }],
    ['meta', { name: 'og:description', content: 'Terminal tabs as the UI. No tmux. CLI is herd.' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Agent Herder',
    nav: [
      { text: 'Guide', link: '/guide/what-is-herd' },
      { text: 'Reference', link: '/reference/commands' },
      { text: 'GitHub', link: 'https://github.com/generativereality/agentherder' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is herd?', link: '/guide/what-is-herd' },
          { text: 'Getting Started', link: '/guide/getting-started' },
        ],
      },
      {
        text: 'Guides',
        items: [
          { text: 'Session Workflows', link: '/guide/workflows' },
          { text: 'Claude Code Skill', link: '/guide/claude-code-skill' },
          { text: 'Configuration', link: '/guide/configuration' },
        ],
      },
      {
        text: 'Reference',
        items: [{ text: 'Commands', link: '/reference/commands' }],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/generativereality/agentherder' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@generativereality/agentherder' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 generativereality',
    },
  },
})
