# Contributing

Thanks for considering a contribution to LensLab.

## Branch Naming

Use short, descriptive branch names with one of these prefixes:

- `feat/` for user-facing features
- `fix/` for bug fixes
- `chore/` for maintenance and tooling
- `docs/` for documentation-only changes

## Commit Messages

Use Conventional Commits:

```text
feat(ui): add language toggle
fix(api): normalize provider errors
docs: update deployment notes
chore: refresh screenshots
```

## Pull Requests

- Do not push directly to `main`.
- Keep PRs focused and reasonably small.
- Include screenshots for UI changes when practical.
- Make sure type checks and builds pass before requesting review.
- Explain provider-specific behavior when changing OpenAI or Gemini code paths.

## Local Development

Install dependencies:

```bash
npm install
```

Copy the sample environment file:

```bash
cp .env.example .env.local
```

Run locally through Vercel so API routes are available:

```bash
npx vercel dev
```

For UI-only work, Vite is enough:

```bash
npm run dev
```

## Required Checks

Run these before opening or updating a PR:

```bash
npx tsc --noEmit --pretty false
npm run build
```

Screenshot updates can be regenerated with:

```bash
npm run screenshots
```

## Testing Policy

See [docs/testing/TDD_BDD_POLICY.md](./docs/testing/TDD_BDD_POLICY.md) for the current TDD/BDD policy and quality gate direction.

## Issues

Search existing issues before opening a new one. For usage questions, prefer GitHub Discussions if enabled; otherwise open a focused issue with reproduction steps, environment details, and expected behavior.
