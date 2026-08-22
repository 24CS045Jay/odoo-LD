# World Trotter Project Structure

The repository contains the complete runnable application source. Generated folders such as `node_modules/`, `dist/`, logs, and real `.env` files are intentionally excluded because they are rebuilt or configured locally.

```text
odoo-LD/
├── client/                         # React + Vite interface
│   ├── index.html                  # App metadata, fonts, favicon
│   ├── public/
│   │   └── assets/
│   │       └── images/             # Local logo, hero, region, and destination images
│   └── src/
│       ├── api/                    # JWT-aware REST client
│       ├── components/             # Shared UI, layout, cards, animations
│       ├── contexts/               # Client application contexts
│       ├── lib/                    # Presentation data and UI utilities
│       └── pages/                  # Route-level screens
├── server/                         # Express API and backend modules
│   ├── controllers/                # REST request handlers
│   ├── middleware/                 # Auth, errors, validation, uploads
│   ├── models/                     # Mongoose models
│   ├── routes/                     # REST route definitions
│   ├── seed/                       # Development catalog and trip data
│   └── _core/                      # Framework integration helpers
├── shared/                         # Types and shared constants
├── drizzle/                        # Template database artifacts
├── .env.example                    # Safe local environment-variable template
├── README.md                       # Setup, API, security, and demo guidance
├── PROJECT_STRUCTURE.md            # This structure guide
├── package.json                    # Scripts and dependencies
└── vite.config.ts                  # Vite configuration
```

## Local startup

```bash
pnpm install
cp .env.example .env
# Set MONGODB_URI and JWT_SECRET in .env
pnpm dev
```

The web application is available at `http://localhost:3000`. The client and API run together through the development server.

## Local images

All current image files are committed under `client/public/assets/world-trotter/`. They are referenced with `/assets/world-trotter/...` paths, so they remain visible after cloning the repository and running it locally. See that folder’s `README.md` for instructions on adding images.
