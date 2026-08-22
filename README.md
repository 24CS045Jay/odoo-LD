# World Trotter

**World Trotter** is a travel-planning application with a React/Vite frontend and an Express, MongoDB/Mongoose, JWT backend. It preserves the ivory, nautical-navy, and antique-gold travel-journal visual system while persisting authentication, trips, itinerary sections, activities, expenses, city and activity discovery, community posts, sharing, and admin analytics through REST endpoints.

## Run locally

Install dependencies with `pnpm install`, copy `.env.example` to `.env`, configure the required values, then run `pnpm dev`. The unified Express server starts on port `3000`, serves the REST API under `/api`, and hosts the Vite client in development. Use `pnpm check` for TypeScript validation, `pnpm test` for the connection and application checks, `pnpm build` for the production bundle, and `pnpm seed` to create catalog and planning demo data. See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for the complete source-tree map.

The application requires the platform-managed `MONGODB_URI` and `JWT_SECRET` values. To run outside this environment, configure an Atlas URI, a JWT secret of at least 16 characters, `JWT_EXPIRES_IN=7d`, and `CLIENT_URL` for the deployed client origin. Connection details are intentionally not committed.

## Seeded development access

The seed command creates a demo traveler at `demo@worldtrotter.app` and an administrator at `admin@worldtrotter.app`. Both accounts use the development-only password `WorldTrotterDemo2026`. Change or remove these accounts before production use. The seed creates cities, activities, trips, itinerary sections, and expenses. It intentionally does **not** fabricate community posts, comments, likes, ratings, or testimonials; use the live community interface for genuine contributions.

## Core API map

| REST resource | Key routes | Frontend use |
|---|---|---|
| Authentication | `POST /api/auth/register`, `/login`, `/demo-login`; `GET /me`; `POST /logout` | Login, registration, session state |
| Users | `GET/PUT/DELETE /api/users/:id`; avatar, password, and saved-destination routes | Profile and account management |
| Trips | `GET/POST /api/trips`; `GET/PUT/DELETE /api/trips/:id`; duplicate and cover routes | Dashboard, My Trips, Create Trip |
| Itinerary | Nested `/api/trips/:tripId/sections` and activity routes | Itinerary Builder and Review |
| Budget and calendar | `/api/trips/:tripId/budget`, nested expense CRUD, `GET /api/calendar` | Budget and Calendar |
| Discovery | `GET /api/cities`, `GET /api/activities`; admin CRUD | Cities and Activities |
| Community | `/api/community`, comments, and likes | Community feed and future post workflow |
| Sharing and admin | `/api/public/:shareToken`, `/api/admin/*` | Shared itinerary and Admin analytics |

All list endpoints support the shared search, filter, sort, grouping, and pagination contract. API responses use `{ success, data, message }`; validation, MongoDB, JWT, and generic exceptions are normalized by the central error middleware.

## Security and storage

The API uses Helmet headers, configured CORS, a rate limit on authentication endpoints, bcrypt password hashing, JWT bearer tokens, Zod validation, role checks, and centralized errors. Multipart image uploads accept JPEG, PNG, WebP, and GIF files up to 5 MB, then use the platform storage helper to persist a returned `/manus-storage/...` URL. Password hashes are excluded from serialized responses.

## Visual system

The interface uses a warm ivory canvas, sand paper surfaces, deep nautical navy actions, and muted antique-gold wayfinding. Cormorant Garamond and Manrope work with a compass globe, travel-planning ribbon, route lines, ledger grids, and field-note details throughout the planning journey. All current logo and destination images are committed for local use in `client/public/assets/world-trotter/`.
