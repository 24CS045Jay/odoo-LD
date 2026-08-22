# World Trotter

**World Trotter** is a premium, frontend-only travel planning interface built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, Wouter, Lucide, and Recharts. The current iteration focuses on the complete client-side experience: the World Trotter rebrand, page navigation, visual storytelling, travel-journal motifs, route/budget displays, and responsive behavior.

## Run locally

Install dependencies with `pnpm install`, start the interface with `pnpm dev`, and open the local Vite URL printed in the terminal. Use `pnpm check` for TypeScript validation, `pnpm test` for the small frontend verification suite, and `pnpm build` to produce the production frontend bundle.

## Frontend routes

The implemented journey includes the landing page, dashboard, my trips, create trip, itinerary builder, itinerary view, budget, city search, activity search, calendar, community, shared itinerary, profile, admin preview, sign in, and registration routes. Create Trip → Itinerary Builder → Itinerary View is wired as a linear client-side flow.

## Current scope

This version deliberately uses **local presentation data**. Database persistence, JWT authentication, CRUD actions, client API modules, Express routes, and MongoDB/Mongoose wiring are deferred to the next implementation prompt, as requested. The existing backend-capability scaffolding is retained for that later phase, but the active development and build scripts intentionally run the frontend-only Vite experience.

## Visual system

The interface uses a warm ivory canvas, sand paper surfaces, deep nautical navy actions, and muted antique-gold wayfinding. It pairs DM Serif Display with Plus Jakarta Sans and repeats the World Trotter compass globe, coordinate ribbons, route lines, ledger grids, and field-note details across the travel journey.

