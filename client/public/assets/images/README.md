# Local Image Asset Pipeline

All images required for a local World Trotter run are stored here and served at `/assets/images/...`.

| Folder | Purpose |
| --- | --- |
| `logo/` | Compact emblem, full lockup, and favicon |
| `hero/` | Home, login, and registration imagery |
| `regions/` | Regional discovery-card images |
| `destinations/` | City and heritage destination images |
| `activities/` | Activity-card imagery |
| `community/` | Default community visuals |
| `avatars/` | Default avatar visuals |

To add an image, place it in the matching folder, use a descriptive lowercase filename, and register it in `client/src/lib/imageRegistry.ts`. User-facing components should use `AppImage` from `client/src/components/shared/AppImage.tsx` rather than a raw `<img>` element.
