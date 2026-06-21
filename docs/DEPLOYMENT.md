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

## Docker Notes

### Build Image

```bash
cd distribution/docker-build
docker build -t animarr .
```

### Test Configuration

Docker test configs located in `docker/tests/`:
- `mono/sonarr/Dockerfile` - Mono-based test
- `mono/complete/Dockerfile` - Complete test

## TrueNAS Deployment Notes

### Considerations

1. **Storage:** Map `/data` volume for configuration
2. **Network:** Host networking recommended for download client access
3. **Permissions:** Run as non-root user (sonarr:sonarr → animarr:animarr)
4. **Updates:** Disable automatic updates initially

### Docker Compose Example

```yaml
version: '3.8'
services:
  animarr:
    image: animarr:latest
    container_name: animarr
    volumes:
      - /path/to/config:/config
      - /path/to/tv:/tv
      - /path/to/downloads:/downloads
    ports:
      - 8989:8989
    restart: unless-stopped
```

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
