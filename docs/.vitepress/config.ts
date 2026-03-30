import { defineConfig } from 'vitepress'

const siteUrl = 'https://agentherder.com'
const ogTitle = 'Agent Herder — Self-aware agentic coding across terminal tabs'
const ogDescription = 'Install one plugin and Claude spawns 10, 15 parallel sessions on its own — each in a named terminal tab. No tmux. No TUI.'

export default defineConfig({
  title: 'Agent Herder',
  description: 'Self-aware agentic coding across terminal tabs. Install one plugin and Claude spawns parallel sessions — each in a named terminal tab. No tmux. No TUI.',
  lang: 'en-US',

  sitemap: {
    hostname: siteUrl,
  },

  head: [

    // OpenGraph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: siteUrl }],
    ['meta', { property: 'og:image', content: `${siteUrl}/og.png` }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { property: 'og:site_name', content: 'Agent Herder' }],

    // Twitter / X card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: ogTitle }],
    ['meta', { name: 'twitter:description', content: ogDescription }],
    ['meta', { name: 'twitter:image', content: `${siteUrl}/og.png` }],

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
