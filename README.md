# Ons Buurt

[![Frontend Tests](https://github.com/ons-buurt/ons-buurt/actions/workflows/ci.yml/badge.svg)](https://github.com/ons-buurt/ons-buurt/actions/workflows/ci.yml)
[![Backend Tests](https://github.com/ons-buurt/ons-buurt/actions/workflows/ci.yml/badge.svg)](https://github.com/ons-buurt/ons-buurt/actions/workflows/ci.yml)

Community-powered safety for the Cape Flats. Report incidents, find safe zones, and walk together.

**Walk Safe. Walk Together.**

## Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20 LTS)
- npm 9+

### Run the application

```bash
# Install dependencies
npm install
cd backend && npm install
```

Run frontend and backend in separate terminals:

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend (requires Doppler + DATABASE_URL)
cd backend && doppler run -- npm run start:dev
```

### Documentation

- **[Frontend](frontend/README.md)** — Tech stack, scripts, features
- **[Backend](backend/README.md)** — API endpoints, Doppler setup
- **[Backend Architecture](backend/docs/ARCHITECTURE.md)** — Hexagonal design
