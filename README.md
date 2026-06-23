# Mini Identity Directory Dashboard

A small but intentionally structured identity directory dashboard built with **Next.js App Router**, **TypeScript**, **TanStack Query v5**, **Tailwind CSS**, **Vitest**, **React Testing Library**, and **MSW**.

The application fetches simulated enterprise identity users from ReqRes through a **Backend-for-Frontend** boundary. The frontend never calls ReqRes directly. Instead, browser requests go through internal Next.js route handlers, where the upstream response is sanitized, normalized, and enriched before being returned to the UI.

---

## Table of Contents

- [Overview](#overview)
- [Core Requirements Covered](#core-requirements-covered)
- [Tech Stack](#tech-stack)
- [Architecture Summary](#architecture-summary)
- [Folder Structure](#folder-structure)
- [Data Flow](#data-flow)
- [Backend-for-Frontend Boundary](#backend-for-frontend-boundary)
- [API Key Handling](#api-key-handling)
- [Client-Safe Domain Contract](#client-safe-domain-contract)
- [TanStack Query Cache Strategy](#tanstack-query-cache-strategy)
- [UI Strategy](#ui-strategy)
- [Testing Strategy](#testing-strategy)
- [Running the Project](#running-the-project)
- [Environment Variables](#environment-variables)
- [Important Architectural Decisions](#important-architectural-decisions)
- [Tradeoffs](#tradeoffs)
- [Scalability Notes](#scalability-notes)
- [Future Improvements](#future-improvements)

---

## Overview

This project implements a **Mini Identity Directory Dashboard** for a simulated enterprise identity portal.

The dashboard allows a user to:

- View a directory list of identity users.
- Select a user to load an expanded detail view.
- See loading skeletons while data is being fetched.
- See recoverable error states when the BFF cannot return data.
- Benefit from an explicit TanStack Query cache lifecycle strategy.

Although the project is intentionally small, it is structured as an enterprise-style application rather than a quick take-home demo. The goal is to demonstrate clear ownership of boundaries, cache lifecycle reasoning, testability, and maintainability.

---

## Core Requirements Covered

The implementation covers the main assessment requirements:

### BFF Layer

- Next.js route handlers expose internal API routes:
  - `GET /api/users`
  - `GET /api/users/:id`

- The browser never calls ReqRes directly.
- ReqRes is treated as an upstream provider, not as the frontend contract.
- The BFF sanitizes and reshapes upstream data before returning it to the client.
- The BFF enriches the response with a mock enterprise identity flag: `requiresMFA`.

### Frontend UI

- Responsive identity directory dashboard.
- Polished card-based layout using Tailwind CSS.
- Skeleton loading states for perceived performance.
- Detail panel that fetches focused user data only after selection.
- Recoverable error states for list and detail requests.

### TanStack Query v5

- Server state is managed with TanStack Query.
- Query keys are centralized.
- `staleTime` and `gcTime` are explicitly configured.
- List and detail data have different cache lifecycles based on sensitivity.

### Testing

The test suite includes:

- Mapper tests for BFF data shaping.
- Cache policy tests for `staleTime` and `gcTime`.
- Dashboard integration tests using:
  - Vitest
  - React Testing Library
  - MSW

---

## Tech Stack

- **Next.js App Router**
- **React**
- **TypeScript**
- **TanStack Query v5**
- **Tailwind CSS**
- **Vitest**
- **React Testing Library**
- **MSW**
- **happy-dom**

---

## Architecture Summary

The application uses a domain-oriented structure.

The feature is called `identity-directory`, not `reqres`, because ReqRes is only an upstream data provider. The frontend and most of the application should not care where identity data comes from.

The high-level architecture is:

```txt
Browser UI
  ↓
TanStack Query hooks
  ↓
Identity Directory client
  ↓
Shared browser BFF client
  ↓
Next.js Route Handlers
  ↓
Identity Directory server service
  ↓
Identity Directory upstream client
  ↓
Shared server HTTP client
  ↓
ReqRes API
```

This separation keeps the system testable, modular, and easy to evolve if the upstream provider changes later.

---

## Folder Structure

```txt
src/
├── app/
│   ├── api/
│   │   └── users/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── providers.tsx
│
├── features/
│   └── identity-directory/
│       ├── api/
│       │   ├── identity-directory.cache.ts
│       │   ├── identity-directory.client.ts
│       │   └── identity-directory.keys.ts
│       ├── components/
│       │   ├── identity-directory-dashboard.tsx
│       │   ├── identity-directory-skeleton.tsx
│       │   ├── identity-user-card.tsx
│       │   └── identity-user-detail-panel.tsx
│       ├── hooks/
│       │   ├── use-identity-user.ts
│       │   └── use-identity-users.ts
│       └── types/
│           └── identity-user.ts
│
├── server/
│   ├── identity-directory/
│   │   ├── identity-directory.config.ts
│   │   ├── identity-directory.errors.ts
│   │   ├── identity-directory.mapper.ts
│   │   ├── identity-directory.service.ts
│   │   ├── identity-directory.upstream-client.ts
│   │   └── identity-directory.upstream.types.ts
│   └── shared/
│       └── http/
│           └── server-http-client.ts
│
├── shared/
│   ├── api/
│   │   └── bff-client.ts
│   └── ui/
│       ├── app-error-state.tsx
│       ├── app-panel.tsx
│       └── app-section-heading.tsx
│
└── test/
    ├── feature/
    │   └── identity-directory/
    │       └── components/
    │           └── identity-directory-dashboard.test.tsx
    ├── msw/
    │   ├── handlers.ts
    │   └── server.ts
    ├── server/
    │   └── identity-directory/
    │       └── identity-directory.mapper.test.ts
    ├── identity-directory.cache.test.ts
    ├── render-with-query-client.tsx
    └── setup.ts
```

---

## Data Flow

### Directory List Flow

```txt
IdentityDirectoryDashboard
  ↓
useIdentityUsers()
  ↓
fetchIdentityUsers()
  ↓
getBffJson('/api/users')
  ↓
GET /api/users
  ↓
getIdentityUsers()
  ↓
fetchIdentityUsersFromUpstream()
  ↓
ReqRes /users?page=1
  ↓
mapReqResUsersResponseToIdentityUsersResponse()
  ↓
Client-safe IdentityUsersResponse
```

### User Detail Flow

```txt
User selects an identity
  ↓
IdentityUserDetailPanel receives userId
  ↓
useIdentityUser({ userId })
  ↓
fetchIdentityUserById(userId)
  ↓
getBffJson('/api/users/:id')
  ↓
GET /api/users/:id
  ↓
getIdentityUserById(userId)
  ↓
fetchIdentityUserByIdFromUpstream(userId)
  ↓
ReqRes /users/:id
  ↓
mapReqResSingleUserResponseToIdentityUserResponse()
  ↓
Client-safe IdentityUserResponse
```

The detail query is disabled until a user is selected. This avoids preloading focused identity records unnecessarily.

---

## Backend-for-Frontend Boundary

The frontend is treated as untrusted.

The browser only calls internal BFF endpoints:

```txt
/api/users
/api/users/:id
```

It never calls:

```txt
https://reqres.in/api/users
```

This is intentional.

The BFF gives us a server-controlled boundary where we can:

- Hide upstream API keys.
- Hide upstream response shapes.
- Normalize response naming.
- Remove unwanted upstream metadata.
- Add enterprise-specific identity fields.
- Translate upstream failures into stable application errors.
- Add authentication, authorization, rate limiting, or audit logging later.

The BFF is not a blind proxy. It is a contract boundary.

---

## API Key Handling

ReqRes requires an API key via the `x-api-key` header.

The key is read from:

```env
REQRES_API_KEY=your_reqres_api_key_here
```

The key is intentionally not prefixed with `NEXT_PUBLIC_`.

In Next.js, environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser bundle. Because this key is a server-side credential, it must remain server-only.

The API key is only used in the server-side upstream client:

```txt
src/server/identity-directory/identity-directory.upstream-client.ts
```

The browser never receives or sends the ReqRes API key.

---

## Client-Safe Domain Contract

ReqRes returns users like this:

```ts
{
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}
```

The frontend receives this instead:

```ts
{
  id: number;
  email: string;
  fullName: string;
  avatarUrl: string;
  requiresMFA: boolean;
  accountStatus: "active";
  identityProvider: "reqres-simulator";
}
```

This mapping happens in:

```txt
src/server/identity-directory/identity-directory.mapper.ts
```

### Why this matters

The frontend should depend on the product/domain contract, not the upstream provider contract.

If ReqRes is replaced later with Entra ID, Okta, Auth0, a real identity service, or an internal API, the frontend should not need a major rewrite.

---

## TanStack Query Cache Strategy

The assessment specifically evaluates cache lifecycle understanding, especially `staleTime` and `gcTime`.

The cache policy is centralized in:

```txt
src/features/identity-directory/api/identity-directory.cache.ts
```

Current policy:

```ts
usersList: {
  staleTime: 30_000,
  gcTime: 120_000,
}

userDetail: {
  staleTime: 10_000,
  gcTime: 60_000,
}
```

### List Query

```txt
staleTime: 30 seconds
gcTime: 2 minutes
```

The directory list is useful for navigation and contains less focused information than a detail record.

A 30-second `staleTime` avoids unnecessary BFF requests during quick navigation while still allowing reasonably frequent revalidation.

A 2-minute `gcTime` keeps the list in memory briefly after it is no longer observed. This improves UX if the user navigates away and returns shortly after.

### Detail Query

```txt
staleTime: 10 seconds
gcTime: 1 minute
```

A selected identity detail record is treated as more sensitive because it represents focused personal identity data.

A shorter `staleTime` means detail records become eligible for revalidation sooner.

A shorter `gcTime` means unused detail records leave memory sooner after the component unmounts or stops observing them.

### Why list and detail use different values

Identity data has different sensitivity levels depending on context.

A list of users is useful for navigation and can tolerate a slightly longer cache lifecycle.

A detail record is more focused and should not remain fresh or retained for as long.

This balances:

- User experience
- Reduced redundant requests
- Sensitive data handling
- Predictable cache behavior

---

## Why TanStack Query

TanStack Query is used because the dashboard is dealing with server state, not just local UI state.

It provides:

- Declarative loading, error, and success states.
- Request deduplication.
- Background revalidation.
- Cache lifecycle control.
- Query key-based invalidation.
- Separation of server state from component state.

The dashboard component does not call `fetch` directly. It consumes feature hooks:

```ts
useIdentityUsers();
useIdentityUser({ userId });
```

This makes the UI easier to test and keeps data fetching policy outside presentation code.

---

## Query Keys

Query keys are centralized in:

```txt
src/features/identity-directory/api/identity-directory.keys.ts
```

Example:

```ts
identityDirectoryKeys.usersList();
identityDirectoryKeys.userDetail(userId);
```

Centralized query keys prevent accidental cache fragmentation.

For example, without centralized keys, different parts of the codebase could accidentally use:

```ts
["users"]["identity-users"][("identity-directory", "users")];
```

That would create multiple caches for the same data.

---

## UI Strategy

The UI is built with Tailwind CSS.

Tailwind was chosen for this assessment because it allows a polished, responsive dashboard to be built quickly without adding a full component library.

The styling choice is intentionally limited to the presentation layer.

The architecture does not depend on Tailwind. The BFF boundary, server services, mappers, hooks, cache policy, and tests would remain valid if the UI were later migrated to CSS Modules, a design system, or a component library.

### Skeleton Loading

Skeleton components are used to improve perceived performance.

Instead of showing a blank screen while data loads, the UI shows the expected structure of the page:

- Directory card skeletons
- Detail panel skeleton

The skeletons are feature-specific because loading shapes often depend on the layout of the screen.

---

## Reusable UI Components

Shared UI primitives live under:

```txt
src/shared/ui
```

Examples:

```txt
app-panel.tsx
app-error-state.tsx
app-section-heading.tsx
```

These components standardize common UI patterns without moving identity-specific behavior into the shared layer.

Feature-specific components remain inside:

```txt
src/features/identity-directory/components
```

This prevents premature abstraction while still reducing duplication.

---

## Testing Strategy

The testing approach is intentionally targeted rather than broad.

The goal is to test the highest-risk parts of the assessment:

1. BFF response shaping
2. Cache lifecycle policy
3. Query-driven UI states

### Test Types

#### Mapper Tests

Mapper tests verify that raw ReqRes data is transformed into the client-safe identity contract.

They check that:

- `first_name` and `last_name` become `fullName`
- `avatar` becomes `avatarUrl`
- `requiresMFA` is added server-side
- upstream support metadata is not leaked

#### Cache Policy Tests

Cache tests verify that the explicit `staleTime` and `gcTime` values are protected from accidental changes.

They also verify that detail records are shorter-lived than list records.

#### Dashboard Integration Tests

Dashboard tests use:

- Vitest
- React Testing Library
- MSW
- TanStack Query

The tests exercise the real hooks and the real browser-side BFF client.

MSW intercepts internal BFF routes such as:

```txt
/api/users
/api/users/:id
```

The tests mock the BFF endpoints, not ReqRes.

That reflects the real frontend contract:

```txt
Frontend → BFF
```

not:

```txt
Frontend → ReqRes
```

### Why MSW

MSW provides network-level mocking.

This is stronger than simply mocking the identity-directory client module because it verifies that the component, hook, client, and request layer work together.

It also helps catch accidental direct frontend calls to unexpected URLs.

---

## Running the Project

### Install dependencies

```bash
npm install
```

### Add environment variables

Create:

```txt
.env.local
```

Add:

```env
REQRES_API_KEY=your_reqres_api_key_here
```

### Run development server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

### Run tests

```bash
npm run test
```

### Run lint

```bash
npm run lint
```

### Build

```bash
npm run build
```

---

## Environment Variables

### `.env.example`

```env
REQRES_API_KEY=your_reqres_api_key_here
```

### `.env.local`

```env
REQRES_API_KEY=your_real_reqres_api_key
```

`.env.local` should not be committed.

Recommended `.gitignore` entry:

```gitignore
.env*
!.env.example
```

---

## Important Architectural Decisions

### 1. Domain-oriented naming

The feature is named:

```txt
identity-directory
```

not:

```txt
reqres
```

ReqRes is only an upstream provider.

The domain should outlive the vendor.

---

### 2. BFF instead of direct client calls

The frontend never calls ReqRes directly.

This keeps upstream credentials, upstream schema details, and provider errors away from the browser.

It also gives the server a place to enforce future security concerns such as authentication, tenant scoping, rate limiting, audit logging, and authorization.

---

### 3. Separate upstream types from domain types

ReqRes types live under:

```txt
src/server/identity-directory/identity-directory.types.ts
```

Client-safe types live under:

```txt
src/features/identity-directory/types/identity-user.ts
```

This avoids leaking vendor-specific response shapes into the browser-facing contract.

---

### 4. Mapper as sanitization boundary

The mapper is the explicit place where upstream data becomes application data.

This keeps sanitization testable and visible.

It also makes the BFF more than a proxy.

---

### 5. Shared server HTTP client plus domain upstream client

Generic HTTP behavior lives in:

```txt
src/server/shared/http/http-client.ts
```

Identity-specific upstream behavior lives in:

```txt
src/server/identity-directory/identity-directory.client.ts
```

This avoids duplicating low-level HTTP logic across domains while keeping provider-specific knowledge out of shared infrastructure.

---

### 6. Shared browser BFF client

Frontend-to-BFF HTTP behavior lives in:

```txt
src/shared/api/bff-client.ts
```

Feature code calls this shared client rather than calling `fetch` directly.

This centralizes:

- JSON parsing
- error normalization
- `cache: 'no-store'`
- same-origin credentials

---

### 7. Explicit cache lifecycle

The cache policy is not hidden in random hook options.

It is centralized and documented.

This makes it easy to defend and easy to test.

---

### 8. No hidden framework caching

BFF route handlers and server upstream requests explicitly avoid hidden caching.

This keeps the assessment focus on TanStack Query’s visible client-side cache lifecycle.

If server-side caching were introduced, it would need to be justified separately.

---

## Tradeoffs

### Tailwind CSS vs CSS Modules

Tailwind was chosen for speed and UI polish.

Pros:

- Fast responsive layout
- Easy skeleton loading
- Consistent spacing
- No extra component library

Cons:

- Class-heavy JSX
- Less semantic styling than CSS Modules
- Larger visual markup

The tradeoff is acceptable here because the architecture is independent of Tailwind.

---

### Native fetch vs Axios

The project uses native `fetch`, but not scattered across the app.

`fetch` is isolated behind:

- `src/shared/api/bff-client.ts` for browser-to-BFF calls
- `src/server/shared/http/server-http-client.ts` for server-to-upstream calls

This avoids unnecessary dependencies while preserving enterprise-style separation.

Axios or Ky could be introduced later if the application needed interceptors, advanced retry policies, request tracing, or more complex HTTP behavior.

### Client-side fetching vs server-side fetching

The dashboard uses client-side fetching through TanStack Query.

This is intentional because the assessment focuses on TanStack Query cache lifecycle management.

A server-rendered approach could reduce client loading states, but it would make the cache lifecycle discussion less central.

---

### MSW vs module mocking

MSW was chosen for dashboard integration tests because it tests a more realistic request flow.

The project still uses plain Vitest tests for pure logic such as mappers and cache constants.

---

### Pagination metadata retained

The BFF returns:

```ts
{
  (users, page, total, totalPages);
}
```

Even though the assessment only requires page 1, retaining pagination metadata makes the directory easier to extend later.

---

## Scalability Notes

This architecture can scale in several directions.

### Additional identity providers

If ReqRes is replaced by another provider, only the server-side upstream client, upstream types, and mapper should need major changes.

The frontend contract can remain stable.

### Pagination

The current response already includes pagination metadata.

The list query key can evolve from:

```ts
identityDirectoryKeys.users();
```

to:

```ts
identityDirectoryKeys.users({ page, search });
```

### Search and filters

Search and filters can be added by extending:

- BFF query params
- server service input
- upstream client input
- query keys

The query key must include the search/filter values to prevent cache collisions.

### Authentication

Authentication can be added at the BFF route layer.

This would allow the server to reject unauthorized browser requests before contacting the upstream provider.

## Future Improvements

Given more time, I would add:

- Search input with debounced query keys.
- Pagination or infinite scrolling.
- Request correlation IDs.
- BFF route tests.
- Authentication middleware.
- More detailed upstream error mapping.
- Accessibility audit with keyboard navigation checks.
- Storybook stories for UI states.
- Playwright end-to-end tests.
- Runtime schema validation with Zod.
