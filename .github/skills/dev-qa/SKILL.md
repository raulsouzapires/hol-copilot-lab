---
name: dev-qa
description: 'Create, review, analyze, and improve unit tests for The Daily Harvest project using Vitest, React Testing Library, user-event, and jsdom. Use for component tests, test coverage, accessibility-oriented queries, test failures, and isolated frontend test workflows.'
argument-hint: 'Target a component, hook, utility, or existing test file'
user-invocable: true
disable-model-invocation: false
---

# dev-qa

Use this skill for unit-testing work in The Daily Harvest project. Keep the work focused on tests: create or improve test files, inspect failures, analyze coverage gaps, and recommend or apply only test-support changes when necessary. Do not implement production frontend features.

## Scope

Use the file, component, hook, utility, or test supplied by the user as the default scope. Do not expand to unrelated production code unless required to understand and test that target.

Run commands from `eCommApp/`, which contains the Vite, Vitest, React Testing Library, user-event, jsdom, and TypeScript configuration.

## Project Test Conventions

- Vitest APIs are commonly imported explicitly from `vitest`: `describe`, `it`, `beforeEach`, `expect`, and `vi`.
- Use `@testing-library/react` for rendering and queries.
- Use `@testing-library/user-event` for interactions; create it with `userEvent.setup()`.
- Rely on the global jsdom environment configured in `vite.config.ts`.
- The setup file is `src/test/setup.ts`; it imports `@testing-library/jest-dom`.
- Prefer accessible queries first: `getByRole`, `getByLabelText`, `findByRole`, and `getByRole` with an accessible name.
- Use `getByText`, `getByTestId`, and other query variants only when role-based queries are not practical.
- Match the existing style in `src/components/CartPage.test.tsx`: clear describe/test names, small fixtures, provider helpers, focused mocks, and explicit assertions.

## Arrange-Act-Assert

Make each test easy to read:

1. Arrange fixtures, mocks, providers, and render state.
2. Act by clicking, typing, submitting, or invoking the smallest realistic user interaction.
3. Assert visible output, state transitions, callback calls, and absence of controls when relevant.

Use clear names that describe behavior, such as:

- `displays an empty state and no checkout controls when the cart is empty`
- `confirms checkout once and displays the processed order`
- `returns an accessible validation message after invalid submission`

## Workflow

### 1. Inspect

Inspect the target component and nearby types, providers, utilities, and tests. Identify:

- Behavioral inputs and outputs
- Loading, empty, error, success, and disabled states
- User interactions and keyboard or accessibility behavior
- Context dependencies, network calls, timers, and child components

### 2. Plan

List the applicable cases rather than adding tests indiscriminately. Prioritize:

- Happy paths
- Empty states
- Loading states
- Error states
- Disabled controls
- Relevant user interactions
- Important state transitions and callback behavior
- Accessibility-oriented behavior

### 3. Build

- Keep each test isolated and deterministic.
- Use `vi.clearAllMocks()` or equivalent cleanup in `beforeEach` when mocks persist across tests.
- Mock network requests, context providers, timers, or child components only when that makes the test more focused and maintainable.
- Do not make tests depend on real external I/O.
- Use provider wrappers or fixture helpers to reduce repeated setup.
- Await asynchronous behavior and use `findBy*` queries or explicit Vitest assertions where appropriate.
- Avoid brittle implementation-detail assertions when user-visible behavior can be asserted instead.
- Restore manually created spies or mocks when their scope ends.

### 4. Run

Run the narrowest useful Vitest command:

```powershell
cd eCommApp
npm run test:run -- src/components/CartPage.test.tsx
```

For a test-name subset, use a focused Vitest filter:

```powershell
npm run test:run -- src/components/CartPage.test.tsx -t "empty state"
```

If Vitest is unavailable or dependencies are not installed, use the existing npm scripts without changing the dependency manifest.

### 5. Analyze and Improve

When reviewing existing tests:

- Explain failures before changing them.
- Remove or replace assertions that are redundant, brittle, order-dependent, or tied to irrelevant implementation details.
- Add missing edge cases only when they are supported by the target behavior.
- Check whether mocks preserve the behavior under test.
- Verify that setup cleanup prevents state leaking between tests.
- Ensure the suite remains readable and maintainable.
- Consider coverage gaps, but do not add low-value tests solely to raise percentages.

### 6. Report

Summarize:

- Files reviewed or changed
- Cases added, removed, or improved
- Why each significant change is necessary
- Verification command and result
- Remaining gaps or unavailable validation

## Example Structure

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('TargetComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completes the user action and displays the result', async () => {
    const user = userEvent.setup();

    render(<TargetComponent />);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByRole('status')).toHaveTextContent('Complete');
  });
});
```

Adapt imports and provider wrappers to the target component. Match TypeScript types and existing project conventions.