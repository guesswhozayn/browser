# Small Web — Sites & Browser

A custom web browser client and publishing backend for exploring interconnected one-page websites living in MongoDB.

## Stack
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Backend**: NestJS 11, Mongoose / MongoDB, TypeScript (strict)
- **Monorepo**: npm workspaces (`apps/api`, `apps/web`)

---

## Commands to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database (Deterministic & Idempotent)
Populates 5 personas, 10 interconnected web pages (with links to missing pages), and ~1 hour of realistic browsing history:
```bash
npm run seed
```

### 3. Start Backend API (Port 4000)
```bash
npm run dev:api
```

### 4. Start Browser Frontend (Port 3000)
```bash
npm run dev:web
```

---

## Architecture & Requirements Reference
- **HTML Containment**: Untrusted author HTML is isolated in `<iframe sandbox="allow-scripts" srcDoc={...}>` (without `allow-same-origin`), blocking escape to parent DOM, storage, or parent cookies. Link navigation (`<a href="...">`) is captured via event listener and posted to the parent browser session via `postMessage`.
- **Navigation & History Invariant**: Linear navigation stack (`entries: NavigationEntry[]`, `cursor: number`) truncates forward history upon new navigation and preserves per-entry scroll positions (`scrollY`).
- **Visits vs. History**: An append-only log of `Visit` records (`person`, `address`, `via: typed|link|history|search|back|forward`, `visitedAt`) queryable per browsing persona.
- **Search**: MongoDB `$text` full-text index across stripped `textContent`, titles, and addresses with dynamic excerpt snippets.

