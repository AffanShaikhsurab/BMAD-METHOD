# BMAD-METHOD — Repository Structure and Developer Guide

A high-level and file-by-file map of the BMad Method codebase so a new developer or AI agent can quickly understand what exists, how pieces relate, how to build, and where to change things safely.

---

## Table of Contents

- [Overview](#overview)
- [Repository Tree](#repository-tree)
- [High-level Architecture](#high-level-architecture)
- [Folder Summaries](#folder-summaries)
  - [.github](#github)
  - [.husky](#husky)
  - [.vscode](#vscode)
  - [bmad-core](#bmad-core)
  - [common](#common)
  - [dist](#dist)
  - [docs](#docs)
  - [expansion-packs](#expansion-packs)
  - [tools](#tools)
  - [Top-level files](#top-level-files)
- [Detailed File Entries](#detailed-file-entries)
- [Quick Start / Dev Workflow](#quick-start--dev-workflow)
- [Notable Configs & CI](#notable-configs--ci)
- [Glossary](#glossary)
- [Open Questions & Recommended Next Steps](#open-questions--recommended-next-steps)
- [Index / Search Shortcuts](#index--search-shortcuts)

---

## Overview

BMad Method is a universal AI agent framework and methodology for agentic, agile, mixed greenfield/brownfield development. The repository provides:

- Core agents, tasks, templates, and workflows (bmad-core)
- A CLI/installer to scaffold BMad content into other projects (tools/installer)
- Build tooling to produce web-ready bundles and distribution artifacts (tools/cli, tools/builders)
- Expansion packs for specialized domains (expansion-packs)

---

## Repository Tree

Top 2–3 levels shown. Generated/third-party areas are marked when known.

```
BMAD-METHOD/
├─ .github/
│  ├─ ISSUE_TEMPLATE/
│  │  ├─ bug_report.md
│  │  └─ feature_request.md
│  ├─ workflows/
│  │  └─ release.yaml
│  └─ FUNDING.yaml
├─ .husky/
│  └─ pre-commit
├─ .vscode/
│  └─ settings.json
├─ bmad-core/
│  ├─ agent-teams/
│  │  ├─ team-all.yaml
│  │  ├─ team-fullstack.yaml
│  │  ├─ team-ide-minimal.yaml
│  │  └─ team-no-ui.yaml
│  ├─ agents/
│  │  ├─ analyst.md
│  │  ├─ architect.md
│  │  ├─ bmad-master.md
│  │  ├─ bmad-orchestrator.md
│  │  ├─ dev.md
│  │  ├─ pm.md
│  │  ├─ po.md
│  │  ├─ qa.md
│  │  └─ sm.md
│  │  └─ ux-expert.md
│  ├─ checklists/
│  │  ├─ architect-checklist.md
│  │  ├─ change-checklist.md
│  │  ├─ pm-checklist.md
│  │  ├─ po-master-checklist.md
│  │  ├─ story-dod-checklist.md
│  │  └─ story-draft-checklist.md
│  ├─ data/
│  │  ├─ bmad-kb.md
│  │  ├─ brainstorming-techniques.md
│  │  ├─ elicitation-methods.md
│  │  └─ technical-preferences.md
│  ├─ tasks/
│  │  ├─ advanced-elicitation.md
│  │  ├─ brownfield-create-epic.md
│  │  ├─ brownfield-create-story.md
│  │  ├─ correct-course.md
│  │  ├─ create-brownfield-story.md
│  │  ├─ create-deep-research-prompt.md
│  │  ├─ create-next-story.md
│  │  ├─ document-project.md
│  │  ├─ facilitate-brainstorming-session.md
│  │  ├─ generate-ai-frontend-prompt.md
│  │  ├─ index-docs.md
│  │  ├─ kb-mode-interaction.md
│  │  ├─ review-story.md
│  │  ├─ shard-doc.md
│  │  └─ validate-next-story.md
│  ├─ templates/
│  │  ├─ architecture-tmpl.yaml
│  │  ├─ brainstorming-output-tmpl.yaml
│  │  ├─ brownfield-architecture-tmpl.yaml
│  │  ├─ brownfield-prd-tmpl.yaml
│  │  ├─ competitor-analysis-tmpl.yaml
│  │  ├─ front-end-architecture-tmpl.yaml
│  │  ├─ front-end-spec-tmpl.yaml
│  │  ├─ fullstack-architecture-tmpl.yaml
│  │  ├─ market-research-tmpl.yaml
│  │  ├─ prd-tmpl.yaml
│  │  ├─ project-brief-tmpl.yaml
│  │  └─ story-tmpl.yaml
│  ├─ user-guide.md
│  ├─ workflows/
│  │  ├─ brownfield-fullstack.yaml
│  │  ├─ brownfield-service.yaml
│  │  ├─ brownfield-ui.yaml
│  │  ├─ greenfield-fullstack.yaml
│  │  ├─ greenfield-service.yaml
│  │  └─ greenfield-ui.yaml
│  └─ core-config.yaml
├─ common/
│  ├─ tasks/
│  │  ├─ create-doc.md
│  │  └─ execute-checklist.md
│  └─ utils/
│     ├─ bmad-doc-template.md
│     └─ workflow-management.md
├─ dist/  (generated)
│  ├─ agents/
│  │  ├─ analyst.txt
│  │  ├─ architect.txt
│  │  ├─ bmad-master.txt
│  │  ├─ bmad-orchestrator.txt
│  │  ├─ dev.txt
│  │  ├─ pm.txt
│  │  ├─ po.txt
│  │  ├─ qa.txt
│  │  ├─ sm.txt
│  │  └─ ux-expert.txt
│  └─ teams/
│     ├─ team-all.txt
│     ├─ team-fullstack.txt
│     ├─ team-ide-minimal.txt
│     └─ team-no-ui.txt
├─ docs/
│  ├─ core-architecture.md
│  ├─ expansion-packs.md
│  ├─ GUIDING-PRINCIPLES.md
│  ├─ how-to-contribute-with-pull-requests.md
│  ├─ versioning-and-releases.md
│  └─ versions.md
├─ expansion-packs/
│  ├─ bmad-2d-phaser-game-dev/
│  │  ├─ agent-teams/
│  │  ├─ agents/
│  │  ├─ checklists/
│  │  ├─ config.yaml
│  │  ├─ data/
│  │  ├─ tasks/
│  │  ├─ templates/
│  │  └─ workflows/
│  ├─ bmad-2d-unity-game-dev/
│  │  ├─ agent-teams/
│  │  ├─ agents/
│  │  ├─ checklists/
│  │  ├─ config.yaml
│  │  ├─ data/
│  │  ├─ tasks/
│  │  ├─ templates/
│  │  └─ workflows/
│  └─ bmad-infrastructure-devops/
│     ├─ agents/
│     ├─ checklists/
│     ├─ config.yaml
│     ├─ data/
│     ├─ README.md
│     ├─ tasks/
│     └─ templates/
├─ tools/
│  ├─ bmad-npx-wrapper.js
│  ├─ builders/
│  │  └─ web-builder.js
│  ├─ bump-all-versions.js
│  ├─ bump-expansion-version.js
│  ├─ cli.js
│  ├─ installer/
│  │  ├─ bin/
│  │  │  └─ bmad.js
│  │  ├─ config/
│  │  │  └─ install.config.yaml
│  │  ├─ lib/
│  │  │  ├─ config-loader.js
│  │  │  ├─ file-manager.js
│  │  │  ├─ ide-base-setup.js
│  │  │  ├─ ide-setup.js
│  │  │  ├─ installer.js
│  │  │  ├─ memory-profiler.js
│  │  │  ├─ module-manager.js
│  │  │  └─ resource-locator.js
│  │  ├─ package.json
│  │  ├─ package-lock.json
│  │  └─ README.md
│  ├─ lib/
│  │  ├─ dependency-resolver.js
│  │  └─ yaml-utils.js
│  ├─ md-assets/
│  │  └─ web-agent-startup-instructions.md
│  ├─ semantic-release-sync-installer.js
│  ├─ sync-installer-version.js
│  ├─ update-expansion-version.js
│  ├─ upgraders/
│  │  └─ v3-to-v4-upgrader.js
│  ├─ version-bump.js
│  └─ yaml-format.js
├─ .gitignore
├─ .prettierignore
├─ .prettierrc
├─ .releaserc.json
├─ CHANGELOG.md
├─ CONTRIBUTING.md
├─ LICENSE
├─ log.txt
├─ package.json
├─ package-lock.json
└─ README.md
```

Notes:

- dist/ is generated by build steps. Do not edit by hand.
- node_modules/ is intentionally git-ignored and not present in repo.
- Some files in CI and scripts appear partially incomplete (see notes in sections below).

---

## High-level Architecture

- Core content (agents, tasks, templates, workflows) lives under bmad-core/ and defines the domain prompts, structures, and operational flows for agent collaboration.
- The build system (tools/cli.js with WebBuilder) produces distribution artifacts into dist/ and can also build web-friendly bundles and expansion packs.
- The installer (tools/installer) provides an interactive CLI (bmad / bmad-method) to install BMad content into other projects and optionally set up IDE integrations.
- Expansion packs (expansion-packs/) contribute additional agents, teams, tasks, templates for specialized domains (e.g., Phaser 2D games, Unity, Infrastructure/DevOps).
- CI uses semantic-release to automate versioning and releases, syncing versions between main package and installer.

Data flow:

- Author edits bmad-core content → build with tools/cli → dist text bundles for agents/teams → installer/CLI can package/copy content into target projects/IDEs.

---

## Folder Summaries

### .github

- Purpose: GitHub metadata (issue templates, CI workflows, funding).
- Entry points: workflows/release.yaml (semantic-release pipeline), ISSUE_TEMPLATE/\*.md.
- Build/runtime notes: CI runs on pushes to main and manual dispatch. Requires Node and npm.
- Tests location: None defined in CI (formatting only, no test runner configured).
- Important configs: release.yaml (see Notable Configs & CI).
- Owners: Repo owner: AffanShaikhsurab. Upstream author in package.json: Brian (BMad) Madison.

### .husky

- Purpose: Git hooks. pre-commit runs lint-staged to format/lint YAML/Markdown.
- Entry points: .husky/pre-commit.
- Build/runtime notes: Requires husky to be set up via npm prepare.
- Tests: None.
- Important configs: lint-staged in package.json.

### .vscode

- Purpose: Workspace settings to improve agent tooling and spell-check.
- Entry points: settings.json.
- Notes: Enables chat/agent features and defines cSpell words.

### bmad-core

- Purpose: Source-of-truth for the BMad methodology content (agents, teams, tasks, templates, workflows) and core config.
- Entry points: agents/_.md for personas; templates/_.yaml for document templates; workflows/\*.yaml for orchestration; core-config.yaml for behavior flags/paths.
- Build/runtime notes: Consumed by tools/lib/dependency-resolver and tools/builders/web-builder.
- Tests location: None in repo.
- Important configs: core-config.yaml.

### common

- Purpose: Shared tasks/utilities used by multiple agents or flows.
- Entry points: common/tasks/_.md, common/utils/_.md.
- Tests: None.

### dist

- Purpose: Generated bundles for agents and teams (text files). Do not edit.
- How generated: tools/cli build step via WebBuilder. Marked as outputDirs (default ./dist).
- Tests: N/A (generated).

### docs

- Purpose: Human documentation for architecture, contribution, versioning.
- Entry points: docs/\*.md.
- Tests: N/A.

### expansion-packs

- Purpose: Optional domain packs extending core (Phaser, Unity, Infrastructure/DevOps).
- Entry points: each pack’s config.yaml; same internal structure as bmad-core.
- Build/runtime: Built via tools/cli build (expansions) and used by installer.
- Tests: None in repo.

### tools

- Purpose: All Node.js tooling — build system, CLI installer, helpers, release sync.
- Entry points: tools/cli.js (builder CLI), tools/installer/bin/bmad.js (installer CLI), tools/builders/web-builder.js.
- Build/runtime: Requires Node >= 20 (see package.json engines), npm scripts.
- Tests: None.
- Important configs: semantic release plugin, version sync scripts.

### Top-level files

- package.json: metadata, scripts, engines; main entry tools/cli.js; bin for bmad wrappers.
- README.md: project intro and badges.
- .releaserc.json: semantic-release plugins configuration.
- .prettierrc/.prettierignore: formatting rules.
- .gitignore: ignores node_modules, logs, build outputs, various IDE/vendor folders.
- CHANGELOG.md: release notes (managed by semantic-release).
- CONTRIBUTING.md, LICENSE: community/legal.
- log.txt: appears to be a log artifact (no clear producer in code) — treat as non-source.

---

## Detailed File Entries

Below are concise entries. For large families of similar files (e.g., agents), individual items are listed with short purposes.

### .github/ISSUE_TEMPLATE/bug_report.md

- Purpose: GitHub issue template for bug reports.
- Role: Guides submitters to include reproduction, expected behavior, env details.
- Side effects: None.

### .github/ISSUE_TEMPLATE/feature_request.md

- Purpose: GitHub issue template for feature requests.
- Role: Captures problem, proposed solution, alternatives.

### .github/workflows/release.yaml

- Purpose: CI workflow to format, optionally bump versions (manual), and run semantic-release on push.
- Role: Checks out repo, sets up Node, runs npm ci, runs format, optionally manual version bump, then semantic-release.
- Important configs/env: Uses GITHUB_TOKEN; semantic-release/npm would typically need NPM_TOKEN to publish (not visible here).
- Notes / Risks: File as present seems truncated at the "Semantic Release" step (no uses/run defined). Verify complete workflow in repo.

### .husky/pre-commit

- Purpose: Pre-commit hook to run lint-staged.
- How to run/test: Husky is auto-installed via npm prepare.
- Notes: Ensure lint-staged configuration exists in package.json.

### .vscode/settings.json

- Purpose: Workspace settings enabling chat agent features and dictionary words.

### bmad-core/core-config.yaml

- Purpose: Core configuration for PRD and architecture sharding, dev behavior, and slashPrefix.
- Important keys:
  - markdownExploder, prd._, architecture._, devLoadAlwaysFiles, devDebugLog, devStoryLocation, slashPrefix: BMad.
- Side effects: Guides how documents are split/loaded in workflows and tools.

### bmad-core/agents/\*.md

- Purpose: Agent personas (analyst, architect, bmad-master, orchestrator, dev, pm, po, qa, sm, ux-expert) with YAML blocks specifying commands, dependencies, and behaviors.
- Role: Consumed by tools/lib/dependency-resolver and builders; used to generate dist/\*.txt versions.
- Notes: Public API in YAML; text content defines prompting rules.

### bmad-core/agent-teams/\*.yaml

- Purpose: Define collections of agents into teams (all, fullstack, ide-minimal, no-ui) for collaborative workflows.
- Role: Used by builders/installer to compose bundles.

### bmad-core/checklists/\*.md

- Purpose: Task/checklist templates for DoD, PM/PO and architecture checks.

### bmad-core/data/\*.md

- Purpose: Knowledge base and technique guides referenced by agents and tasks.

### bmad-core/tasks/\*.md

- Purpose: Task prompt templates for various flows (elicitation, brownfield story, validation, etc.).

### bmad-core/templates/\*.yaml

- Purpose: Structured templates (PRD, architecture, market research, stories, etc.).
- Notes: Some examples reference Todo/Todo List AI duplicate detection. Replace or parameterize for your project as needed.

### bmad-core/workflows/\*.yaml

- Purpose: Greenfield and Brownfield workflow orchestrations (ui/service/fullstack).

### bmad-core/user-guide.md, working-in-the-brownfield.md

- Purpose: Usage guides; emphasize large-context tools (Gemini) for brownfield analysis.

### common/tasks/create-doc.md, execute-checklist.md; common/utils/\*.md

- Purpose: Shared task scaffolds and utilities.

### dist/\* (generated)

- Purpose: Textified agent and team bundles built by tools/cli using WebBuilder.
- Source of truth: bmad-core/ and expansion-packs/.
- How generated: npm run build (tools/cli → tools/builders/web-builder.js).

### docs/\*.md

- Purpose: Human docs for core architecture, versioning, contribution.

### expansion-packs/\*/config.yaml

- Purpose: Metadata for each pack (name, version, description, slashPrefix).
- Packs:
  - bmad-2d-phaser-game-dev (v1.11.0)
  - bmad-2d-unity-game-dev (v1.2.0)
  - bmad-infrastructure-devops (v1.10.0)

### tools/bmad-npx-wrapper.js

- Purpose: Wrapper to ensure the installer runs correctly when invoked via npx.
- Role: Detects npx temp dir; locates installer/bin/bmad.js and executes it with args; falls back to local require otherwise.
- Exports: Executable script (bin entry). No exports; uses execSync.
- Side effects: Spawns child process executing installer.
- Risks: Path assumptions; logs error if bmad.js not found.

### tools/builders/web-builder.js

- Purpose: Build web/distribution bundles from core content.
- Exports: Class WebBuilder with methods, including:
  - constructor(options), parseYaml, convertToWebPath, generateWebInstructions,
  - cleanOutputDirs, buildAgents, buildTeams, buildAgentBundle, buildTeamBundle,
  - processAgentContent, formatSection, replaceRootReferences,
  - validate, buildAllExpansionPacks, buildExpansionPack,
  - buildExpansionAgentBundle, buildExpansionTeamBundle,
  - listExpansionPacks, listAgents.
- Dependencies: node:fs/promises, node:path, ../lib/dependency-resolver, ../lib/yaml-utils.
- Side effects: Reads/writes files under dist/; parses YAML from agent markdown.

### tools/cli.js

- Purpose: CLI to build agents/teams and expansion pack bundles.
- Exports: Executable (commander program).
- Commands:
  - build [--agents-only | --teams-only | --expansions-only | --no-expansions | --no-clean]
  - build:expansions [--expansion <name>] [--no-clean]
- Dependencies: WebBuilder, upgraders/v3-to-v4-upgrader (not shown here), installer/IdeSetup (for some flows).

### tools/lib/yaml-utils.js

- Purpose: Extract YAML blocks from agent markdown.
- Exports:
  - extractYamlFromAgent(agentContent: string, cleanCommands?: boolean): string|null — returns YAML inside triple-backtick code fences, optionally normalizing command descriptions.

### tools/lib/dependency-resolver.js

- Purpose: Resolve agent/team dependencies by reading agent YAML and related resources.
- Exports: Class DependencyResolver with methods:
  - resolveAgentDependencies(agentId), resolveTeamDependencies(teamId), loadResource, listAgents, listTeams.
- Dependencies: fs, path, js-yaml, yaml-utils.

### tools/installer/bin/bmad.js

- Purpose: Main entry for installer CLI (bmad / bmad-method).
- Exports: Executable using commander with command `install` and options:
  - --full, --expansion-only, --directory, --ide <list>, --expansion-packs <list>
- Dependencies: installer/lib/\* modules.

### tools/installer/lib/\*.js

- Purpose: Installer internals.
- Key modules:
  - installer.js — Orchestrates install/update/repair/reinstall, IDE setup, manifests, detection of existing installs (v3→v4 upgrade path support).
  - config-loader.js — Loads install.config.yaml; enumerates agents/teams/expansion packs; resolves dependencies.
  - file-manager.js — Copy, glob, manifest creation, hash integrity, backups.
  - ide-setup.js (+ ide-base-setup.js) — Writes IDE-specific rule/command files for Cursor, Claude Code, Windsurf, etc.
  - module-manager.js — Dynamic ESM import cache to reduce memory.
  - resource-locator.js — Centralized path resolution and caching; glob lookups.
  - memory-profiler.js — Optional memory checkpoints and reporting.

### tools/installer/config/install.config.yaml

- Purpose: Defines install options (full vs single-agent), and IDE configurations with rule directories and instructions for Cursor, Claude Code, Windsurf, etc.

### tools/installer/package.json

- Purpose: Installer’s own package metadata to allow npx bmad-method.
- Notes: Version is kept in sync with root via semantic-release plugin and sync script.

### tools/semantic-release-sync-installer.js

- Purpose: Semantic-release plugin step to set installer package.json version to nextRelease.version during prepare.

### tools/sync-installer-version.js

- Purpose: Utility to copy root package.json version into tools/installer/package.json when needed.

### tools/update-expansion-version.js

- Purpose: Utility to set a specific expansion pack version in its config.yaml.

### tools/bump-\*.js, version-bump.js

- Purpose: Scripts for bumping versions (some intentionally disabled in favor of semantic-release).
- Notes: version-bump.js prints guidance to use conventional commits.

### tools/upgraders/v3-to-v4-upgrader.js

- Purpose: Upgrade tooling to move projects from v3 to v4 structure (details in file).

### tools/md-assets/web-agent-startup-instructions.md

- Purpose: Markdown asset shipped with web bundles to guide startup.

### docs/\*.md

- Purpose: Guidance and reference docs. See especially:
  - core-architecture.md — overview and lifecycle flows
  - versioning-and-releases.md — semantic-release usage
  - how-to-contribute-with-pull-requests.md — contribution flow

### Top-level configs and metadata

- package.json
  - name: bmad-method, version: 4.31.0, engines: node >= 20
  - bin: bmad, bmad-method → tools/bmad-npx-wrapper.js
  - scripts: build (cli build), list:agents, validate, install:bmad, format, version:\* (manual bump disabled), prepare (husky)
  - dependencies: ora; devDependencies: yaml-lint
- .releaserc.json — semantic-release plugins: commit-analyzer, release-notes, changelog, npm, custom sync plugin, git, github.
- .prettierrc / .prettierignore — formatting.
- .gitignore — excludes node_modules, logs, dist, dot-folders for IDEs.
- README.md — badges and overview; link to YouTube/Discord.

---

## Quick Start / Dev Workflow

Prerequisites:

- Node.js >= 20
- npm 8+

Local setup:

- Install deps: `npm ci`
- Format docs (CI parity): `npm run format`
- Build bundles (agents, teams, expansions): `npm run build`
  - Options: `node tools/cli.js build --agents-only` or `--teams-only` or `--expansions-only`
- List agents: `npm run list:agents`
- Validate content: `npm run validate`

Use the installer in another project:

- `npx bmad-method install`
  - Choose full core, specific agents, and IDE integrations.

Releasing:

- Use conventional commits (feat:, fix:, chore:, docs:, refactor:, perf:, etc.).
- Push to main triggers semantic-release; ensure required tokens are configured (see CI notes).

Testing:

- No automated tests are provided. Recommend adding unit/integration tests for builders, installer, and release scripts.

---

## Notable Configs & CI

- CI: .github/workflows/release.yaml
  - Triggers: push to main; workflow_dispatch with version_type input.
  - Steps: checkout, setup-node (registry-url), npm ci, format, optional manual bump, semantic-release.
  - Required secrets: GITHUB_TOKEN (provided by GitHub); for npm publishing, set NPM_TOKEN as repo secret (and ensure semantic-release/npm is configured).
  - Note: The Semantic Release step appears truncated in the provided file — verify the full action step is present and correctly configured.
- Semantic-release: .releaserc.json configures changelog, npm, git commits, GitHub releases, and a custom plugin to sync installer version.
- Pre-commit: .husky/pre-commit runs lint-staged; ensure lint-staged config is present in package.json and targets YAML/MD as intended.

---

## Glossary

- Agent: A persona definition with commands/rules to guide an LLM.
- Team: A set of agents for coordinated workflows.
- Workflow: A YAML-defined orchestration for greenfield/brownfield flows.
- Template: A YAML document template (e.g., PRD, architecture) filled by agents.
- Expansion Pack: A domain-specific extension of BMad core content.
- Brownfield/Greenfield: Enhancing an existing project vs. starting new.
- WebBuilder: Build system that compiles agent/team content into distributable bundles.
- Installer: CLI that installs core/expansion content into a target project and configures IDE rules.

---

## Open Questions & Recommended Next Steps

Open questions (Why unclear):

- CI workflow release.yaml appears incomplete at the Semantic Release step; confirm the full action configuration.
- No test suite present. What is the intended testing strategy (unit/integration for builders/installer)?
- log.txt origin and rotation not documented.

Recommended next steps:

- Add tests for tools/builders/web-builder.js and tools/installer/lib/\* with a minimal fixture project.
- Complete CI to run tests and linting; add Node matrix if needed.
- Document expansion pack build/publish flow and required secrets.
- Add owner/maintainer metadata (CODEOWNERS/MAINTAINERS) and per-folder ownership.
- Replace example "Todo List AI duplicate detection" placeholders in templates with parameterized examples or neutral language.

---

## Index / Search Shortcuts

- Core config: [bmad-core/core-config.yaml](bmad-core/core-config.yaml)
- Agents: [bmad-core/agents/](bmad-core/agents)
- Teams: [bmad-core/agent-teams/](bmad-core/agent-teams)
- Templates: [bmad-core/templates/](bmad-core/templates)
- Workflows: [bmad-core/workflows/](bmad-core/workflows)
- Builder CLI: [tools/cli.js](tools/cli.js)
- Web builder: [tools/builders/web-builder.js](tools/builders/web-builder.js)
- Installer CLI: [tools/installer/bin/bmad.js](tools/installer/bin/bmad.js)
- Installer internals: [tools/installer/lib/](tools/installer/lib)
- Release config: [.releaserc.json](.releaserc.json)
- CI: [.github/workflows/release.yaml](.github/workflows/release.yaml)
- Docs index: [docs/](docs)

---

Skipped items (and why):

- dist/\* — generated output; covered at a high level rather than line-by-line.
- Binary or non-source artifacts (if any appear later) would be summarized only.
