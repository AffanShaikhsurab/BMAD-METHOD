# BMad Learnings Store (.bmad/learnings)

Purpose: Central, append-only knowledge base of fixes discovered by agents. Each line in a .jsonl file is one independent learning.

Structure:

- manifest.yaml — canonical map of categories -> subfolders
- api/ — API related fixes
- database/ — migrations, schema, ORM issues
- routing/ — path/route problems
- functionality/ — general feature defects
- text-issues/ — copy, formatting, markdown, docs
- misc/ — uncategorized until triaged

Conventions:

- File format: JSON Lines (.jsonl). One learning per line.
- Rolling files: Use YYYY-MM.jsonl per category (recommended) to keep files manageable.
- Required fields per entry:
  - issue: string
  - attempts: string[]
  - resolution: string
  - metadata: { date: ISO8601, agent: string, files: string[], tags: string[] }

Example entry:

{"issue":"404 on /api/users","attempts":["cleared cache","restarted server"],"resolution":"fix route prefix '/v1' in users router","metadata":{"date":"2025-08-09T12:34:56Z","agent":"repair-agent-v1","files":["src/routes/users.ts"],"tags":["api","routing"]}}

Usage rules:

- Agents must read manifest.yaml to locate the appropriate category before read/write.
- If no close match is found, perform external search, validate fix, then append a new entry.
- Keep entries concise, factual, and specific; prefer tags to aid retrieval.
