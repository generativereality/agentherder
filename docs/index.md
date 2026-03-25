---
layout: home
title: Agent Herder — Run a Fleet of Claude Code Sessions
description: Session manager for AI coding tools. Terminal tabs as the UI, no tmux. Open, fork, inspect, and close Claude Code sessions from a single CLI.

hero:
  name: Agent Herder
  text: Run a fleet of Claude Code sessions
  tagline: Terminal tabs as the UI. No tmux.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: View on GitHub
      link: https://github.com/generativereality/agentherder

features:
  - title: No tmux
    details: Uses your terminal's native tab API. Each session is a real tab, not a tmux pane. Scrolling and copy-paste work exactly as you expect.
  - title: Fork sessions
    details: Branch any conversation into a new independent tab with claude --resume --fork-session. Try alternative approaches without disrupting the original.
  - title: Claude Code skill included
    details: Claude Code itself can call herd to check what sessions are running, spawn parallel agents, and coordinate across tabs.
  - title: Config-driven defaults
    details: Set flags like --dangerously-skip-permissions once in ~/.config/herd/config.toml and they apply to every session automatically.
  - title: Tab name = session name
    details: Passes --name to claude on every launch. Terminal tab title and Claude session name stay in sync natively.
  - title: Scriptable
    details: Plain CLI output, composable in shell scripts, Claude Code hooks, and automation workflows.
---
