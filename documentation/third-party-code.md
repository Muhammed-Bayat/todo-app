# Third-Party Code

This project uses the direct dependencies listed in `package.json`. `package-lock.json` records the exact installed versions and the transitive packages that npm installs automatically. Transitive packages are not listed below because they were not chosen directly for the application.

## Application dependencies

| Package | Installed version | Why it was chosen |
|---|---:|---|
| `next` | 16.2.12 | Provides the application framework, routing, Server Components, Server Actions, development server and production build system. |
| `react` | 19.2.4 | Provides the component and state model used to build the interactive task interface. |
| `react-dom` | 19.2.4 | Connects React components to the browser DOM and supplies form-status support. |
| `better-sqlite3` | 12.10.0 | Provides a small synchronous SQLite driver suited to a local application without a separate database server, with prebuilt binaries for supported platforms. |

## Development dependencies

| Package | Installed version | Why it was chosen |
|---|---:|---|
| `typescript` | 5.9.3 | Adds static type checking for task data, components, Server Actions and repository code. |
| `eslint` | 9.39.5 | Checks the source code for correctness and maintainability problems. |
| `eslint-config-next` | 16.2.12 | Supplies the Next.js and React-specific ESLint rules recommended for this framework version. |
| `vitest` | 4.1.10 | Runs the automated repository and business-rule tests with TypeScript support. |
| `@types/node` | 20.19.43 | Supplies TypeScript definitions for Node.js APIs such as the file system, paths and temporary directories. |
| `@types/react` | 19.2.18 | Supplies TypeScript definitions for React components, hooks and JSX. |
| `@types/react-dom` | 19.2.4 | Supplies TypeScript definitions for React DOM APIs such as `useFormStatus`. |
| `@types/better-sqlite3` | 7.6.13 | Supplies TypeScript definitions for the SQLite driver. |

No ORM, CSS framework, component library, external API client or hosted database SDK is used. Node.js built-in modules such as `fs`, `path`, `os`, `http`, `https`, `url` and `child_process` are part of the runtime and are not third-party code. The automatic browser launcher uses these built-in modules, so it does not add another installed package.

AI Declaration: The preceding document was generated, reviewed and edited with the assistance of ChatGPT-Web[GPT-5.6 Sol (high)] and Codex[GPT-5.6 Sol (high)].
