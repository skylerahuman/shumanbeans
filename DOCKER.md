# Docker Setup - DigitalOcean App Platform Emulation

This Docker Compose setup exactly emulates your DigitalOcean App Platform droplet environment to ensure 1:1 configuration matching.

## Environment Details

- **Base OS**: Ubuntu 22.04 LTS (matching DO App Platform)
- **Node.js**: 18.x LTS (matching DO App Platform node-js environment)
- **npm**: 8+ (matching DO App Platform requirements)
- **Build Process**: `npm install && npm run build` (exact match)
- **Runtime**: `npm start` (exact match)
- **Port**: 3000 (exact match)
- **Environment**: `NODE_ENV=production` (exact match)

## Quick Start

### Production Mode (Emulates DigitalOcean exactly)

```bash
# Build and run production container
make up

# View logs
make logs

# Stop containers
make down
```

### Development Mode (With live reload)

```bash
# Start development container
make dev

# View dev logs
make logs-dev

# Access:
# - Vite dev server: http://localhost:5173
# - Node.js server: http://localhost:3001
```

## Available Commands

| Command          | Description                                    |
| ---------------- | ---------------------------------------------- |
| `make help`      | Show all available commands                    |
| `make build`     | Build production Docker image                  |
| `make up`        | Start production container (port 3000)         |
| `make dev`       | Start development container (ports 5173, 3001) |
| `make down`      | Stop and remove containers                     |
| `make logs`      | Show production container logs                 |
| `make logs-dev`  | Show development container logs                |
| `make status`    | Show container status                          |
| `make shell`     | Open bash shell in production container        |
| `make shell-dev` | Open bash shell in development container       |
| `make test`      | Test production build and basic connectivity   |
| `make clean`     | Remove containers, images, and volumes         |
| `make rebuild`   | Clean rebuild from scratch                     |

## Raw Docker Compose Commands

If you prefer using Docker Compose directly:

### Production

```bash
# Build
docker compose build web

# Start
docker compose up -d web

# Logs
docker compose logs -f web

# Stop
docker compose down
```

### Development

```bash
# Start development with live reload
docker compose --profile dev up -d web-dev

# Logs
docker compose logs -f web-dev

# Stop
docker compose --profile dev down
```

## Configuration Matching

### DigitalOcean App Platform → Docker

- `environment_slug: node-js` → Ubuntu 22.04 + Node.js 18.x
- `instance_size_slug: basic-xxs` → 0.5 CPU, 512MB RAM limits
- `build_command: npm install && npm run build` → Dockerfile RUN commands
- `run_command: npm start` → CMD ["npm", "start"]
- `http_port: 3000` → EXPOSE 3000
- `NODE_ENV: production` → Environment variable

### File Structure

```
.
├── Dockerfile              # Production image (Ubuntu 22.04)
├── Dockerfile.dev          # Development image with live reload
├── docker-compose.yml      # Multi-service orchestration
├── .dockerignore           # Optimized build context
├── Makefile                # Convenience commands
└── DOCKER.md               # This documentation
```

## Resource Limits

The production container is configured with resource limits that simulate the DigitalOcean `basic-xxs` instance:

- **CPU**: 0.5 cores (limit), 0.25 cores (reservation)
- **Memory**: 512MB (limit), 256MB (reservation)

## Health Checks

Both containers include health checks that match DigitalOcean App Platform monitoring:

- **Interval**: Every 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3 attempts
- **Start Period**: 40 seconds

## Volumes and Development

The development container mounts your source code for live development:

- Source code: `.:/app`
- Node modules: `/app/node_modules` (excluded from mount)
- Build cache: `/app/.svelte-kit` (excluded from mount)

## Troubleshooting

### Build Issues

```bash
# Clean rebuild
make rebuild

# Check build logs
docker compose build web --progress=plain
```

### Runtime Issues

```bash
# View detailed logs
make logs

# Access container shell
make shell

# Check container health
docker compose ps
```

### Port Conflicts

If ports 3000, 3001, or 5173 are in use:

```bash
# Check what's using the port
sudo netstat -tulpn | grep :3000

# Stop conflicting services or modify docker-compose.yml ports
```

## Notes

1. **Package Management**: The container uses `npm` instead of `yarn` to exactly match DigitalOcean App Platform behavior, even though your project has a `yarn.lock` file.

2. **Build Process**: The production image runs the full build process (`npm run build`) during image creation, just like DigitalOcean App Platform.

3. **Security**: Both containers run as a non-root user (`appuser`) for security, matching DigitalOcean App Platform practices.

4. **Environment Variables**: All environment variables from your `.do/app.yaml` are replicated in the Docker setup.

This setup provides a local development environment that exactly matches your DigitalOcean App Platform production environment, ensuring consistent behavior between local testing and production deployment.
