# ARCHITECTURE.md - Animarr

## Repository Structure

```
Animarr/
├── .devcontainer/          # Dev container configuration
├── .github/                # GitHub workflows, templates
├── .vscode/                # VS Code launch/task configs
├── distribution/           # Platform packaging
│   ├── debian/             # Debian/Ubuntu packages
│   ├── docker-build/       # Docker build files
│   ├── macOS/              # macOS .app bundle
│   └── windows/            # Windows Inno Setup installer
├── docker/                 # Docker test configurations
├── frontend/               # React/TypeScript frontend
│   ├── build/              # Webpack build config
│   ├── src/
│   │   ├── Components/     # Reusable UI components
│   │   ├── Content/        # Static assets (images, fonts, icons)
│   │   ├── Styles/         # Theme definitions (light/dark)
│   │   └── [Feature]/      # Feature modules (Series, Settings, etc.)
│   └── typings/            # TypeScript type definitions
├── Logo/                   # Master logo files (SVG, PNG at various sizes)
├── schemas/                # XML schemas
├── scripts/                # Build/test shell scripts
└── src/                    # C#/.NET backend
    ├── NzbDrone.Host/      # Application host/bootstrap
    ├── NzbDrone.Core/      # Core business logic
    ├── NzbDrone.Common/    # Shared utilities
    ├── Sonarr.Http/        # HTTP layer
    ├── Sonarr.Api.V3/      # API v3 controllers
    └── Sonarr.Api.V5/      # API v5 controllers
```

## Frontend Architecture

### Technology Stack
- **Framework:** React 18.3.1
- **Language:** TypeScript 5.7.2
- **Build:** Webpack 5.105.2
- **State:** Zustand 5.0.3
- **Routing:** React Router 7.15.1
- **Styling:** CSS Modules + PostCSS
- **Icons:** FontAwesome 7.2.0

### Key Components
- `PageHeader` - Top navigation bar with logo
- `PageSidebar` - Side navigation with logo
- `LoadingPage` - Initial loading screen with logo
- Theme system in `Styles/Themes/dark.js` and `light.js`

### Entry Points
- `frontend/src/index.ejs` - HTML template (browser title, meta, favicon refs)
- `frontend/src/index.ts` - JavaScript entry
- `frontend/src/bootstrap.tsx` - React mount

## Backend Architecture

### Technology Stack
- **Framework:** .NET 10.0
- **Language:** C#
- **ORM:** Dapper
- **Migrations:** FluentMigrator
- **Testing:** NUnit + FluentAssertions

### Key Projects
- `NzbDrone.Host` - Application bootstrap and hosting
- `NzbDrone.Core` - Business logic, services, rules
- `Sonarr.Http` - HTTP server, static file serving
- `Sonarr.Api.V3/V5` - REST API controllers

### Build Process
1. **Backend:** `dotnet build src/Sonarr.sln`
2. **Frontend:** `yarn build` (Webpack → `_output/UI/`)
3. **Combined:** Backend serves frontend from `_output/UI/`

## Build Commands

```bash
# Frontend build
yarn install
yarn build

# Backend build
dotnet build src/Sonarr.sln

# Development watch mode
yarn start

# Linting
yarn lint
yarn stylelint
```

## Test Commands

```bash
# Frontend lint
yarn lint

# Backend tests
dotnet test src/Sonarr.sln
```
