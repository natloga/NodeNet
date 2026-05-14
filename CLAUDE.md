# Global Claude Instructions

## GStack Skills

GStack is installed at `~/.claude/skills/gstack`. Skills are invoked by name (e.g. `/ship`, `/qa`).

Skill index: `~/.claude/skills/gstack/gstack/llms.txt`

### Available Skills

| Skill | Description |
|-------|-------------|
| `/autoplan` | Auto-review pipeline — runs CEO, design, eng, and DX reviews sequentially |
| `/benchmark` | Performance regression detection using the browse daemon |
| `/browse` | Fast headless browser for QA testing and site dogfooding |
| `/canary` | Post-deploy canary monitoring |
| `/careful` | Safety guardrails for destructive commands |
| `/context-save` | Save working context |
| `/context-restore` | Restore working context saved by /context-save |
| `/cso` | Chief Security Officer mode |
| `/design-consultation` | Research landscape, propose complete design system |
| `/design-html` | Generate production-quality HTML/CSS |
| `/design-review` | Designer's eye QA: find and fix visual issues |
| `/design-shotgun` | Generate multiple design variants and iterate on feedback |
| `/devex-review` | Live developer experience audit |
| `/document-generate` | Generate missing documentation for a feature or project |
| `/document-release` | Post-ship documentation update |
| `/freeze` | Restrict file edits to a specific directory for the session |
| `/unfreeze` | Clear the freeze boundary set by /freeze |
| `/guard` | Full safety mode: destructive warnings + directory-scoped edits |
| `/health` | Code quality dashboard |
| `/investigate` | Systematic debugging with root cause investigation |
| `/land-and-deploy` | Land and deploy workflow |
| `/learn` | Manage project learnings |
| `/make-pdf` | Turn any markdown file into a publication-quality PDF |
| `/office-hours` | YC Office Hours — two modes |
| `/open-gstack-browser` | Launch AI-controlled Chromium with sidebar extension |
| `/pair-agent` | Pair a remote AI agent with your browser |
| `/plan-ceo-review` | CEO/founder-mode plan review |
| `/plan-design-review` | Designer's eye plan review |
| `/plan-devex-review` | Interactive developer experience plan review |
| `/plan-eng-review` | Eng manager-mode plan review |
| `/plan-tune` | Self-tuning question sensitivity + developer psychographic |
| `/qa` | Systematically QA test a web app and fix bugs found |
| `/qa-only` | Report-only QA testing (no fixes) |
| `/retro` | Weekly engineering retrospective |
| `/review` | Pre-landing PR review |
| `/scrape` | Pull data from a web page |
| `/setup-browser-cookies` | Import cookies from real Chromium browser into headless session |
| `/setup-deploy` | Configure deployment settings for /land-and-deploy |
| `/setup-gbrain` | Set up gbrain for this coding agent |
| `/ship` | Ship workflow: merge, test, review, bump version, commit, push, PR |
| `/skillify` | Codify a successful /scrape flow into a permanent browser-skill |
| `/sync-gbrain` | Keep gbrain current with this repo's code |
| `/gstack-upgrade` | Upgrade gstack to the latest version |

### Browse Binary

```
~/.claude/skills/gstack/browse/dist/browse <command> [args]
```

Full browse command reference: `~/.claude/skills/gstack/browse/SKILL.md`

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
