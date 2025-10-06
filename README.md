# Amora — UI-only (Events Module)

A production-quality, UI-only Next.js 15 + TypeScript app implementing the Events module for a Zola-style wedding platform. No backend, no mock APIs, no seeded data. All state is ephemeral via Zustand.

## Tech
- Next.js 15 (App Router) + TypeScript
- MUI 6 (layout, theming)
- PrimeReact (DataTable, Calendar, ConfirmDialog, Toast)
- Zustand (client-only state)
- react-hook-form + zod (validation)
- ESLint + Prettier + Jest/RTL

## Getting Started

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Structure
```
app/
  layout.tsx
  page.tsx
  dashboard/
    layout.tsx
    events/
      page.tsx
components/
  Providers.tsx
  dashboard/
    Sidebar.tsx
    TopBar.tsx
  events/
    EventDialog.tsx
    EventsTable.tsx
lib/
  validation.ts
store/
  themeStore.ts
  eventsStore.ts
types/
  events.ts
styles/
```

## Notes for Future Integration
- Replace Zustand actions with API calls (create/update/delete events) and hydrate on load
- Add authentication and real user/team context
- Replace client-only filtering/pagination with server-driven when APIs exist

## Quality
- `npm run lint` — ESLint (Next + import order)
- `npm test` — Jest + RTL

## Accessibility
- Keyboard accessible controls (dialogs, inputs), visible focus, AA contrast via MUI

