# TDD/BDD Policy (T-Wada Inspired)

## Project overview

LensLab is a Vite + React 19 + TypeScript optical simulation app. The product direction is to let users generate visual simulation scenes while switching image providers between OpenAI `gpt-image-2` and Gemini, with provider API calls mediated by Vercel Functions so browser code never receives server-side API keys.

Current testing framework status: no test framework is installed in this baseline. This document defines the operating policy and scaffold only. When implementation phases advance, the project should introduce the tools below without changing the policy.

## Red -> Green -> Refactor

LensLab development should follow short TDD loops:

1. Red: write one failing test that describes the next behavior.
2. Green: make the smallest implementation change that passes.
3. Refactor: improve naming, shape, and duplication only while the suite is green.

Feature work starts from a BDD scenario when the behavior is user-visible, then drops to unit or integration tests for the narrow code path. Bug fixes start with a reproducing test or scenario before the fix.

## Test hierarchy

- Unit: Vitest is the intended future runner for pure TypeScript behavior such as prompt construction, provider selection, request normalization, and UI-state reducers.
- Integration: Vercel Functions should be exercised at function/API-proxy level with mocked provider clients, covering request validation, provider routing, timeout handling, and structured error responses.
- E2E: Playwright is the intended future runner for browser workflows such as provider switching, final prompt inspection, error display, map-scene generation, and theme/outfit selection.

Do not add these dependencies as part of this baseline. Add them only when the corresponding implementation work needs executable coverage, and keep commands centralized in CI scripts.

## T-Wada style application examples

### Prompt construction function

- Red: write a failing unit test for a `simulationPrompt` builder that requires scene intent, optical style, and selected provider constraints to appear in the final prompt.
- Green: return a simple hard-coded or minimally composed string that satisfies the first test.
- Triangulation: add a second test with different scene/style inputs so the implementation must generalize.
- Obvious implementation: replace the temporary composition with a readable prompt-building function once behavior is constrained by tests.

### API proxy validation

- Red: write a failing integration test for an OpenAI proxy request missing required prompt text, expecting a structured `400` response with a stable error code.
- Green: add the smallest validation branch in the Vercel Function.
- Triangulation: add invalid provider, empty image input, and upstream timeout cases.
- Obvious implementation: consolidate validation into a small schema/guard only after repeated cases make the duplication visible.

## Team agreements

- New externally visible behavior starts from a BDD scenario or a failing test.
- Every bug fix starts with a reproducing test when a test framework exists for that layer.
- Keep one intent per test and name tests by behavior, not implementation detail.
- Refactors must preserve behavior and run after the relevant checks are green.

## Stack preset

- stack: node
- current required commands: `tsc --noEmit`, `npm run build`
- future unit command: `vitest run`
- future E2E command: `playwright test`
