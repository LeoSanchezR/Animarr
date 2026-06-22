# DEPLOYMENT.md - Animarr Build & Deploy

## Local Development Setup

### Prerequisites

- **.NET SDK:** 10.0.301 (specified in global.json)
- **Node.js:** 20.11.1 (specified in package.json Volta)
- **Yarn:** 1.22.19
- **Git:** Latest

### Initial Setup

```bash
# Clone repository
git clone https://github.com/LeoSanchezR/Animarr "D:\VS Code\Animarr"
cd "D:\VS Code\Animarr"

# Install frontend dependencies
yarn install

# Build frontend
yarn build

# Build backend
dotnet build src/Sonarr.sln
```

### Development Mode

```bash
# Start frontend watch mode (auto-rebuild)
yarn start

# In separate terminal, run backend
dotnet run --project src/NzbDrone.Host/Sonarr.Host.csproj
```

### Linting

```bash
# ESLint
yarn lint

# Auto-fix
yarn lint-fix

# CSS linting
yarn stylelint
```

## Build Commands

| Command | Description |
|---------|-------------|
| `yarn build` | Production frontend build |
| `yarn start` | Dev mode with watch |
| `yarn lint` | Run ESLint |
| `yarn lint-fix` | Auto-fix lint issues |
| `yarn stylelint` | CSS linting |
| `yarn clean` | Clean build artifacts |
| `dotnet build src/Sonarr.sln` | Build backend |
| `dotnet test src/Sonarr.sln` | Run backend tests |

## Docker Deployment (Verified)

### GHCR Image (Recommended)

Pre-built images are published to GitHub Container Registry on every push to `v5-develop`.

| Image | Tags |
|-------|------|
| `ghcr.io/leosanchezr/animarr` | `latest`, `v5-develop`, `sha-<commit>` |
| Platforms | `linux/amd64`, `linux/arm64` |

#### Pull Image

```bash
# Latest
docker pull ghcr.io/leosanchezr/animarr:latest

# Specific branch
docker pull ghcr.io/leosanchezr/animarr:v5-develop
```

#### Run Container

```bash
docker run -d \
  --name animarr \
  -p 30114:8989 \
  -v /path/to/config:/config \
  -v /path/to/tv:/tv \
  -v /path/to/downloads:/downloads \
  ghcr.io/leosanchezr/animarr:latest
```

#### Docker Compose (GHCR)

```yaml
version: '3.8'
services:
  animarr:
    image: ghcr.io/leosanchezr/animarr:latest
    container_name: animarr
    volumes:
      - /path/to/config:/config
      - /path/to/tv:/tv
      - /path/to/downloads:/downloads
    ports:
      - 30114:8989
    restart: unless-stopped
```

### Local Build

```bash
# Build frontend first (needed for Docker context)
yarn build --env production

# Build Docker image (multi-stage: builds backend inside Docker)
docker build -t animarr:local .
```

### Run Container

```bash
docker run -d \
  --name animarr \
  -p 8989:8989 \
  -v /path/to/config:/config \
  animarr:local
```

### Notes

- Uses `mcr.microsoft.com/dotnet/aspnet:10.0` (full, not chiseled)
- `libsqlite3-0` installed in image (required by System.Data.SQLite)
- Build uses `dotnet publish src/Sonarr.sln` (entire solution) to produce complete runtime output including `Sonarr.Mono.dll`
- Output path: `_output/net10.0/linux-x64/publish/` (matches upstream CI structure)
- First boot runs ~250 database migrations (~3 minutes)
- UI serves at http://localhost:8989
- Data persists in `/config` volume

### Docker Compose Example

```yaml
version: '3.8'
services:
  animarr:
    image: animarr:local
    container_name: animarr
    volumes:
      - /path/to/config:/config
      - /path/to/tv:/tv
      - /path/to/downloads:/downloads
    ports:
      - 8989:8989
    restart: unless-stopped
```

## TrueNAS Deployment Notes

### Port Configuration

When deploying Animarr alongside Sonarr on TrueNAS, the ports must not conflict:

| Service | Internal Container Port | TrueNAS Host Port | Notes |
|---------|------------------------|-------------------|-------|
| **Sonarr** | 8989 | 30113 | Existing instance |
| **Animarr** | 8989 | **30114** | Recommended default |

- **Internal port (8989):** The application always listens on 8989 inside the container. This is configurable via `Port` in `config.xml` but should remain 8989 for simplicity.
- **External/Host port (30114):** Map to 30114 on the TrueNAS host to avoid conflicting with Sonarr's 30113.
- **Docker EXPOSE:** The Dockerfile exposes 8989 internally; the host mapping is configured at runtime.

### Considerations

1. **Storage:** Map `/config` volume for configuration
2. **Network:** Host networking recommended for download client access
3. **Permissions:** Run as non-root user (animarr:animarr)
4. **Updates:** Disable automatic updates initially
5. **Port conflicts:** Animarr (30114) must not share a port with Sonarr (30113)

### Docker Run Example

```bash
docker run -d \
  --name animarr \
  -p 30114:8989 \
  -v /path/to/config:/config \
  -v /path/to/tv:/tv \
  -v /path/to/downloads:/downloads \
  ghcr.io/leosanchezr/animarr:latest
```

### Docker Compose Example

```yaml
version: '3.8'
services:
  animarr:
    image: ghcr.io/leosanchezr/animarr:latest
    container_name: animarr
    volumes:
      - /path/to/config:/config
      - /path/to/tv:/tv
      - /path/to/downloads:/downloads
    ports:
      - 30114:8989
    restart: unless-stopped
```

### TrueNAS Custom App (Docker-based)

In TrueNAS SCALE, create a custom Docker app with:

| Setting | Value |
|---------|-------|
| Image | `ghcr.io/leosanchezr/animarr:latest` |
| Container Port | `8989` |
| Host Port | `30114` |
| Volume (config) | `/config` → host path |
| Volume (tv) | `/tv` → host path |
| Volume (downloads) | `/downloads` → host path |

Access Animarr at: `http://<truenas-ip>:30114`

## Output Structure

```
_output/
├── UI/                    # Frontend build output
│   ├── Content/
│   │   ├── Images/        # Logo and icon files
│   │   └── Fonts/
│   └── index.html
└── net10.0/               # Backend build output
    └── Sonarr             # Application executable
```
