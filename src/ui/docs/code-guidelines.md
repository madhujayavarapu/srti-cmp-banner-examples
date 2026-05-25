# React Application Code Guidelines

These guidelines help ensure consistency, readability, and quality in our React codebase.

---

## 1. Project Structure

- Organize source files under `src/` by feature or module as needed.
- Use `components/`, `pages/`, `hooks/`, and `utils/` folders for composability and reuse.

## 2. File Naming

- Use **PascalCase** for component and page files: `MyComponent.jsx`
- Use **camelCase** for hooks and utility files: `useMyHook.js`, `myUtility.js`
- Use `.jsx` for React components, `.js` for other JavaScript files.

## 3. Component Structure

- Prefer **function components** with hooks.
- One component per file.
- The default export should match the filename.

```jsx
// src/components/MyComponent.jsx
export default function MyComponent(props) {
  // ...
}
```

## 4. Hooks

- Name custom hooks starting with `use`, e.g. `useFetchData`.
- Place shared hooks in the `hooks/` folder.
- Use hooks in the correct order and never conditionally.

## 5. Imports

- Group imports: import external libraries first, then internal modules.
- Prefer **named imports** over default imports.
- Use import **aliases** for different file types to make import paths clear and maintainable. For example:
  - `@components/MyComponent.jsx` for components
  - `@hooks/useExample.js` for hooks
  - `@pages/Home.jsx` for pages
  - `@utils/someUtility.js` for utilities
  These aliases should be configured in your build tool (e.g., Vite, Webpack) and resolve directly to their respective folders at runtime.
- Do **not** use wildcard imports.
- Avoid long relative or ambiguous absolute paths—always use the defined import patterns above.

## 6. State Management

- Use `useState`, `useReducer`, and `useContext` for local and shared state.
- Keep props minimal; prefer passing only required values.
- Extract reusable logic into hooks.

## 7. Styling

- Prefer CSS Modules or styled-components when possible.
- Use descriptive, BEM-style classNames for global CSS.
- Do not style with inline CSS objects unless dynamic.

## 8. Props and Type Checking

- Document props with [JSDoc](https://jsdoc.app/) or use TypeScript/PropTypes for type safety.
- Give props descriptive names.

## 9. Side Effects

- Use `useEffect` for side effects, cleanup logic, and subscriptions.
- Clean up subscriptions and event listeners in the return function of `useEffect`.

## 10. Consistency and Linting

- Use ESLint to maintain code quality and prevent common issues.
- Follow the project's **prettier** or code style settings.
- Prefer single quotes (`'`) and semicolons.
- Always run the linter and formatter before committing.
- When adding helper functions or utilities, always check for existing utils in the codebase and reuse them if available, instead of creating duplicate or redundant utilities.

## 11. Performance

- Memoize expensive computations with `useMemo`.
- Use `useCallback` for stable function references passed as props.
- Split code with dynamic imports where possible.

## 12. Accessibility (a11y)

- Use semantic HTML elements.
- Provide `aria-` attributes as needed.
- Ensure keyboard navigation works.
- Test with screen readers for important components.

## 13. Testing

- Prefer testing user interactions with tools like React Testing Library.
- Keep tests near the code they test.
- Write tests for edge cases and error boundaries.

---

Following these guidelines will make our code more maintainable and accessible. For any questions, refer to the [React docs](https://reactjs.org/) or reach out to senior developers.
