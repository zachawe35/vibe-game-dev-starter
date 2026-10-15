# vibe-game-dev-starter
Free Cursor rules, a Claude Code QA agent and a playable Phaser 3 starter for **vibe-coding browser games** with AI.

**▶ Play it in your browser:** https://zachawe35.github.io/vibe-game-dev-starter/

## Use it
- **Cursor:** copy `rules/cursor/*.mdc` into your project's `.cursor/rules/`.
  - `game-core.mdc`: always on. Small diffs, CONFIG-driven tuning, always playable.
  - `phaser.mdc`: Phaser 3 conventions and common bugs.
  - `game-feel.mdc`: juice recipes (shake, hit-stop, squash, particles).
- **Claude Code:** copy `claude/agents/playtester-qa.md` into `.claude/agents/`, then ask: "use the playtester-qa agent to review my last change".
- **Starter game:** run `npx serve starter-phaser`. Arrows or WASD to move, Up/Space/tap to jump, R to restart. Tune everything in `src/config.js`. (`docs/` is a copy served by GitHub Pages.)

## Why
AI assistants write a decent first version of a game, then fall apart: magic numbers, state that leaks on restart, frame-rate bugs. These rules fix the most common failure modes.

## Want the full studio?
**[Vibe Game Dev Agent Kit](https://zachagent.gumroad.com/l/qllhb)** adds:
- 6 Claude Code subagents (designer, programmer, level designer, juice artist, QA, shipper)
- Phaser, Three.js and juice skills
- `/plan-feature`, `/juice-it` and `/ship-it` commands
- 40 prompts
- CLAUDE.md, AGENTS.md and a game design template

## Contributing
PRs with new engine rules (Godot, Kaplay, PixiJS) are welcome.

## License
MIT. The full kit is sold separately and is not covered by this license.
