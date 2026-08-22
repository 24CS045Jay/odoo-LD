# World Trotter Local Images

This folder contains every logo and destination image required by the application when you run the repository locally.

## Run locally

From the repository root, install dependencies with `pnpm install` and start the application with `pnpm dev`. Images in `client/public` are served from the site root, so the app uses paths such as `/assets/world-trotter/world-trotter-rajasthan-fort.jpeg`.

## Add a new image

1. Copy the new image into this folder.
2. Use a descriptive `world-trotter-*.jpg`, `.png`, `.jpeg`, or `.webp` filename.
3. Add its local path in `client/src/lib/presentationData.ts` with `localAsset("your-file-name.ext")`.
4. Run `pnpm dev` and confirm the path opens in the browser.

## Included files

| Category | Files |
| --- | --- |
| Official brand assets | `world-trotter-full-lockup.webp`, `world-trotter-emblem.png`, `world-trotter-favicon.png` |
| Destination imagery | Rajasthan Fort, Ladakh Himalaya, Kerala Backwaters, Taj Mahal, Hampi Temple, Golden Temple |
| Retained original logo files | `world-trotter-logo.png`, `world-trotter-logo_original.png` |
