import { defineConfig } from 'vitepress'

const siteUrl = 'https://agentherder.com'
const ogTitle = 'Agent Herder — run a fleet of Claude Code sessions'
const ogDescription = 'Terminal tabs as the UI. No tmux. CLI is herd.'

export default defineConfig({
  title: 'Agent Herder',
  description: 'Run a fleet of Claude Code sessions. Terminal tabs as the UI, no tmux. CLI is herd.',
  lang: 'en-US',

  sitemap: {
    hostname: siteUrl,
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],

    // OpenGraph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { property: 'og:site_name', content: 'Agent Herder' }],

    // Twitter / X card
    ['meta', { name: 'twitter:card', content: 'summary' }],
    ['meta', { name: 'twitter:title', content: ogTitle }],
    ['meta', { name: 'twitter:description', content: ogDescription }],

    // Additional SEO
    ['meta', { name: 'author', content: 'generativereality' }],
    ['meta', { name: 'keywords', content: 'claude code, ai coding, terminal sessions, agent orchestration, herd, claude code sessions, multi-agent, wave terminal' }],

  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Agent Herder',
    nav: [
      { text: 'Guide', link: '/guide/what-is-agent-herder' },
      { text: 'Reference', link: '/reference/commands' },
      { text: 'GitHub', link: 'https://github.com/generativereality/agentherder' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is Agent Herder?', link: '/guide/what-is-agent-herder' },
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
