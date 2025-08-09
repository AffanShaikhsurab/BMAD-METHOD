# Structure TODO / Open Questions

Open questions (needs confirmation):

- CI workflow `.github/workflows/release.yaml` appears truncated at the `Semantic Release` step. Confirm the complete configuration and add npm publish (NPM_TOKEN) if intended.
- No automated tests: define testing strategy for `tools/builders/web-builder.js`, `tools/lib/*`, and `tools/installer/lib/*`.
- `log.txt` origin/use is unclear; document producer and rotation/ignore strategy.
- Ownership and review responsibilities per folder are not documented (consider CODEOWNERS/MAINTAINERS).

Recommended next steps:

1. Add unit tests with a minimal fixture content tree for WebBuilder and DependencyResolver.
2. Create integration tests for installer flows (mock filesystem) and IDE setup output.
3. Expand CI to run tests and lint, and to build artifacts on tags.
4. Parameterize template example lines that mention specific "Todo List AI duplicate detection" to be more generic or driven by inputs.
5. Add CONTRIBUTING details for conventional commits, branching, and release cadence.
6. Add pack-level docs for building and publishing expansion packs (required secrets, npm scope if any).
