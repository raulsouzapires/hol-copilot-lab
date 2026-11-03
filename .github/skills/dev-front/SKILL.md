---
name: dev-front
description: 'Create, improve, refactor, analyze, and review React frontend code for The Daily Harvest project using TypeScript, React, Vite, React Router, CartContext, and App.css. Use for component development, UI state, responsive styling, accessibility, route integration, and production frontend implementation.'
argument-hint: 'Target a component, route, shared UI state, or frontend feature'
user-invocable: true
disable-model-invocation: false
---

# dev-front

Use this skill for production frontend implementation work in The Daily Harvest project. Keep the work focused on components, routing, shared frontend state, styling, and user-facing behavior. Do not write or evaluate unit tests; use the `dev-qa` skill for that responsibility.

## Scope

Use the target component supplied by the user as the default scope. Work primarily in `eCommApp/src/components/` and use the existing TypeScript, React, and Vite structure.

Run project commands from `eCommApp/`.

Relevant project surfaces include:

- Components: `src/components/`
- Routes: `src/App.tsx`
- Shared cart state: `src/context/CartContext.tsx`
- Shared types and utilities: `src/types/`, `src/utils/`
- Main styling: `src/App.css`
- Vite configuration: `vite.config.ts`

## Project Conventions

- Preserve existing behavior unless the requested feature explicitly requires a change.
- Prefer small, maintainable component boundaries and explicit TypeScript props.
- Use React Router's existing route definitions and navigation patterns.
- Use the existing `CartContext` for cart state rather than introducing a competing state system.
- Follow `CartContext` APIs and types already used by the application.
- Keep shared styling in `src/App.css` unless the project already establishes a more local pattern.
- Match existing naming, formatting, class names, and component structure.
- Use semantic HTML before custom interactive elements.
- Use accessible names and keyboard-friendly interactions.
- Avoid adding dependencies when existing React, Router, context, and CSS capabilities are sufficient.

## Existing Routes and UI Structure

The application currently defines these routes in `src/App.tsx`:

- `/` - Home page
- `/products` - Products page
- `/login` - Login page
- `/admin` - Admin page
- `/cart` - Cart page

`CartProvider` wraps the routes. Components that need cart items or cart operations should consume the existing context through the project's established pattern.

## Workflow

### 1. Inspect

Before editing, inspect:

- The target component and its imports
- Direct callers and children
- Route configuration when navigation is involved
- `CartContext` when cart state is involved
- Types used by the target
- Existing styles in `src/App.css`
- Nearby components for naming, layout, and interaction patterns

Identify the requested behavior and any constraints on existing behavior.

### 2. Define the UI States

Consider the applicable states:

- Loading
- Error
- Empty
- Disabled
- Success or completed
- Responsive
- Focused, hovered, and keyboard-visible interactions
- Accessible names and status announcements

Implement only states relevant to the target; do not introduce unrelated UI.

### 3. Implement

- Place UI behavior and rendering logic in components.
- Keep shared state in the existing context or utility layers when appropriate.
- Use controlled or uncontrolled state consistently with nearby components.
- Update imports and exports without breaking callers.
- Use React Router navigation or links according to the existing application pattern.
- Add CSS class names that match the established styling approach.
- Reuse existing classes and variables before introducing duplicates.
- Preserve working behavior outside the target scope.
- Use `button` for actions and links for navigation.
- Disable controls with the native `disabled` attribute when appropriate.
- Do not add test-only markup or production test branches.

### 4. Styling

When changing presentation:

- Update `eCommApp/src/App.css` for shared application styles.
- Review desktop and `@media (max-width: 768px)` behavior.
- Preserve the existing visual language, spacing, border radii, shadows, colors, and layout patterns.
- Avoid inline styles unless they are dynamic values or the established component requires them.
- Ensure text, controls, focus indicators, and interactive areas remain visible and usable.
- Avoid layout or animation changes that alter existing behavior unintentionally.

### 5. Accessibility

- Prefer semantic elements and natural headings.
- Associate form controls with labels.
- Provide accessible names for icon-only controls.
- Maintain logical focus order.
- Preserve focus for relevant interactions when rebuilding or replacing UI.
- Use native keyboard behavior for buttons, links, and dialogs where possible.
- Use concise status text or live regions only when an asynchronous state needs announcement.
- Do not rely on color alone to communicate status.

### 6. Review

Before reporting completion:

- Check that the change matches the requested scope.
- Verify imports, types, JSX, route paths, and context usage.
- Check for unintended behavior changes.
- Check loading, error, empty, disabled, and responsive states when applicable.
- Review semantic HTML and accessible names.
- Build or run the narrowest relevant validation available.
- Leave test creation and test assertions to `dev-qa`.

## Validation

From `eCommApp/`, the common commands are:

```powershell
npm run build
npm run lint
```

Use `npm run build` for a type and production bundle check. Use the narrowest lint command available when a full lint run is not practical.

Do not use frontend validation tests as a substitute for production implementation review.

## Review Checklist

- The requested target is complete and within scope.
- Existing behavior remains intact unless intentionally changed.
- The implementation uses existing routes and cart context correctly.
- Shared state is not duplicated without need.
- Components use explicit props and predictable state transitions.
- Styling follows `App.css` and responsive conventions.
- Loading, error, empty, and disabled states are handled when applicable.
- Semantic HTML and accessible names are present.
- Keyboard interactions remain usable.
- The build or lint result is reported clearly.

## Reporting

Summarize:

- Files reviewed or changed
- Production behavior implemented or improved
- State, route, context, or styling changes
- Validation performed and the result
- Any remaining scope or validation limitation
