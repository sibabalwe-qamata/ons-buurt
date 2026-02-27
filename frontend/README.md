# Ons Buurt Frontend

Community-powered safety for the Cape Flats. Report incidents, find safe zones, and walk together.

**Walk Safe. Walk Together.**

---

## Overview

Ons Buurt is a React-based web application that empowers Cape Flats communities to crowd-source safety information. Users can report incidents, view a real-time safety map, and join or create walking buddy groups for safer commutes.

---

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 |
| **Build Tool** | Vite 5 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 3 |
| **UI Components** | shadcn/ui (Radix UI primitives) |
| **Routing** | React Router v6 |
| **Animations** | Framer Motion |
| **Maps** | Leaflet |
| **Data Fetching** | TanStack Query (React Query) |
| **Forms** | React Hook Form + Zod (available) |
| **Testing** | Vitest + React Testing Library |

---

## Project Structure

```
frontend/
├── index.html              # HTML entry point
├── public/                 # Static assets (robots.txt, etc.)
│   └── robots.txt
├── src/
│   ├── main.tsx            # React entry point
│   ├── App.tsx             # Root component, routing, providers
│   ├── App.css             # App-level styles
│   ├── index.css           # Global styles, Tailwind, CSS variables
│   ├── components/         # Feature & layout components
│   │   ├── Hero.tsx        # Hero section with CTA
│   │   ├── Navbar.tsx      # Navigation with mobile menu
│   │   ├── Footer.tsx      # Site footer
│   │   ├── SafetyMap.tsx    # Interactive Leaflet map
│   │   ├── IncidentReport.tsx  # Incident submission form
│   │   ├── WalkingBuddy.tsx # Walking group cards
│   │   ├── NavLink.tsx     # Navigation link component
│   │   └── ui/             # shadcn/ui components (40+)
│   ├── pages/
│   │   ├── Index.tsx       # Home page
│   │   └── NotFound.tsx    # 404 page
│   ├── hooks/
│   │   ├── use-toast.ts    # Toast notifications
│   │   └── use-mobile.tsx  # Mobile breakpoint hook
│   ├── lib/
│   │   └── utils.ts        # Utility functions (cn, etc.)
│   └── test/
│       └── setup.ts        # Vitest setup (jest-dom)
└── README.md               # This file
```

Configuration files (`vite.config.ts`, `tailwind.config.ts`, `tsconfig.*.json`) live at the repository root.

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **npm** 9+

### Installation

From the project root:

```bash
npm install
```

### Development

Start the dev server (default: http://localhost:8080):

```bash
npm run dev
```

The app supports hot module replacement (HMR) for fast feedback.

### Build

Production build:

```bash
npm run build
```

Output is written to `dist/` at the project root.

### Preview Production Build

Serve the production build locally:

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

### Testing

Run tests once:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

---

## Key Features

### 1. Hero Section

- Full-width hero with background image
- Tagline: "Walk Safe. Walk Together."
- Scroll-to-section CTAs (Safety Map, Report, Walking Buddy)

### 2. Community Safety Map

- Interactive map (Leaflet + OpenStreetMap) centered on Cape Flats
- Filter by incident type: All, Safe Zone, Caution, Danger
- Markers with popups (title, time, vouches)
- Live feed sidebar synced with map markers

### 3. Incident Report Form

- Incident type: Theft/Mugging, Suspicious Activity, Road Hazard, Safe Zone
- Location (text input)
- Description (textarea)
- Submit triggers toast confirmation (backend integration planned)

### 4. Walking Buddy

- Grid of walking group cards
- Each card: route, time, start/end points, member count, verified badge
- "Join Group" and "Create a New Group" actions (backend integration planned)

### 5. Responsive Navigation

- Fixed navbar with glass effect
- Desktop: inline links + Report Incident button
- Mobile: hamburger menu with slide-down panel

---

## Theming

The app uses CSS variables for theming, defined in `src/index.css`:

- **Light mode** (default): Warm neutrals, amber primary, green secondary
- **Dark mode**: `.dark` class on root (via `next-themes` when enabled)

Semantic colors include `safe`, `warning`, and `danger` for incident types.

### Fonts

- **Headings**: Space Grotesk
- **Body**: Inter

Loaded via Google Fonts in `index.css`.

---

## Path Aliases

The `@/` alias maps to `src/`:

```ts
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
```

---

## Environment Variables

No environment variables are required for the frontend to run. Future backend integration may use:

- `VITE_API_URL` – API base URL
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` – if using Supabase

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server (port 8080) |
| `npm run build` | Production build |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |

---

## Browser Support

Targets modern browsers with ES2020 support. Tested on Chrome, Firefox, Safari, and Edge.

---

## License

MIT © Sibabalwe Qamata

---

## Related

- [Repository](https://github.com/ons-buurt/frontend)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
