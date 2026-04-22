# Quality Gates

## Required CI gates

Current required gates:

- `tsc --noEmit`
- `npm run build`
- `bash scripts/ci/check_tdd_bdd_profile.sh`

Future gates after test framework introduction:

- `vitest run`
- `playwright test`

## Vercel pre-deploy checks

- Production build must complete successfully.
- `dist/` must not contain `OPENAI_API_KEY`, `GEMINI_API_KEY`, or provider secret values.
- Client bundle must not expose server-only `process.env` usage.
- API proxy code must keep provider calls in Vercel Functions, not browser code.

## Security gates

Before deploy or PR approval, check these paths for accidental secret exposure:

- `dist/`
- `api/`

Forbidden strings in deployable output:

- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `process.env` in browser/client bundle output

The `api/` directory may reference `process.env` for server-side runtime access, but it must not log or return secret values.

## Performance gates

- OpenAI image generation should complete in under 120 seconds for the normal user path.
- Vercel Function duration must remain within the configured 300 second ceiling.
- Timeout and cancellation behavior should return structured errors rather than leaving the UI in an indefinite loading state.

## Coverage targets

When Vitest is introduced, target line coverage of 80% or higher for:

- `simulationPrompt` prompt construction behavior
- API proxy validation and structured error handling

Coverage is a design feedback tool, not a replacement for meaningful behavior examples.

## PR checklist

- [ ] Added or updated a behavior scenario when user-visible behavior changes
- [ ] Wrote the failing test first where a test framework exists
- [ ] Kept implementation changes minimal until green
- [ ] Ran current required gates
- [ ] Confirmed no API keys or server secrets are exposed in `dist/`
- [ ] Reviewed refactor diff separately from behavior changes
