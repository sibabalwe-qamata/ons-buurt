# Ons Buurt Backend

NestJS API backend for the Ons Buurt community safety platform.

## Doppler Setup

This project uses [Doppler](https://doppler.com) for secrets management. Follow the [Install CLI](https://docs.doppler.com/docs/install-cli) guide to get started.

### 1. Install Doppler CLI

> **If `doppler` is not recognized** after installing, refresh your terminal PATH:
> ```powershell
> $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
> ```
> Or run `.\doppler-setup.ps1` from the backend folder.

**Windows (winget):**
```powershell
winget install doppler.doppler
```

**Windows (Scoop):**
```powershell
scoop bucket add doppler https://github.com/DopplerHQ/scoop-doppler.git
scoop install doppler
```

**macOS:**
```bash
brew install gnupg
brew install dopplerhq/cli/doppler
```

**Linux (Shell script):**
```bash
(curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sudo sh
```

Verify installation:
```bash
doppler --version
```

### 2. Authenticate

From the project root or `backend/` directory:

```bash
doppler login
```

This opens a browser to authenticate. Only needed once per workplace.

### 3. Project Setup

In the `backend/` directory:

```bash
cd backend
doppler setup
```

Select the `ons-buurt` project and `dev` config (or create them in the [Doppler dashboard](https://dashboard.doppler.com)).

The `doppler.yaml` in this folder pre-configures project and config for easier setup.

### 4. Run with Doppler

Inject secrets as environment variables into your process:

```bash
doppler run -- npm run start:dev
```

Or for a one-off command:

```bash
doppler run -- your-command-here
```

### Recommended Secrets

Add these to your Doppler project config:

| Secret | Description |
|--------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string (e.g. `postgresql://user:pass@host.neon.tech/db?sslmode=require`) |
| `PORT` | API server port (default: 3000) |
| `NODE_ENV` | `development` or `production` |

**DATABASE_URL format:** Use the full connection string from Neon. If the password contains special characters (`@`, `:`, `/`, `#`), ensure it is URL-encoded in Doppler. The backend uses `pg-connection-string` to parse it and explicitly casts the password to a string to avoid "client password must be a string" errors.

## Running the Backend

1. Add `DATABASE_URL` (Neon PostgreSQL connection string) to your Doppler project.
2. From `backend/`:
   ```bash
   doppler run -- npm run start:dev
   ```
3. API runs at http://localhost:3000

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /incidents | Create incident report |
| GET | /incidents?type=safe\|warning\|danger | List incidents |
| POST | /incidents/:id/vouch | Vouch for an incident |
| GET | /buddy-groups | List walking groups |
| POST | /buddy-groups | Create a group |
| POST | /buddy-groups/:id/join | Join a group |
