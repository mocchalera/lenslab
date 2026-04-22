# TDD/BDD Policy (T-Wada Inspired)

## Core principles

- Keep cycles short: Red -> Green -> Refactor.
- Write one failing test at a time.
- Make the smallest implementation change to pass.
- Refactor only while tests are green.

## Team agreements

- New behavior starts from a failing test or scenario.
- Bug fixes require at least one reproducing test first.
- Keep tests readable and intention-revealing.
- Prefer behavior-level naming over implementation details.

## Stack preset

- stack: node
- default test command: `npm test`
- default lint command: `npm run lint`
