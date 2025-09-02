# Shumanbeans Docker Development Commands
# Emulates DigitalOcean App Platform environment with Ubuntu 22.04

.PHONY: help build up down logs clean dev test status shell rebuild

# Default target
help:
	@echo "Available commands:"
	@echo "  make build     - Build the production Docker image"
	@echo "  make up        - Start the production container (port 3000)"
	@echo "  make dev       - Start development container with live reload (port 5173)"
	@echo "  make down      - Stop and remove containers"
	@echo "  make logs      - Show container logs"
	@echo "  make status    - Show container status"
	@echo "  make shell     - Open shell in running container"
	@echo "  make test      - Test the production build locally"
	@echo "  make clean     - Remove all containers, images, and volumes"
	@echo "  make rebuild   - Clean rebuild of images"

# Build the production image
build:
	docker compose build web

# Start production container (matches DigitalOcean App Platform)
up:
	docker compose up -d web
	@echo "🚀 Production container started at http://localhost:3000"
	@echo "Use 'make logs' to view output"

# Start development container with live reload
dev:
	docker compose --profile dev up -d web-dev
	@echo "🔧 Development container started:"
	@echo "  - Vite dev server: http://localhost:5173"
	@echo "  - Node.js server: http://localhost:3001"
	@echo "Use 'make logs-dev' to view output"

# Stop containers
down:
	docker compose --profile dev down

# Show logs for production container
logs:
	docker compose logs -f web

# Show logs for development container
logs-dev:
	docker compose logs -f web-dev

# Show container status
status:
	docker compose ps

# Open shell in running production container
shell:
	docker compose exec web bash

# Open shell in running development container
shell-dev:
	docker compose exec web-dev bash

# Test the production build locally
test:
	@echo "Testing production build..."
	docker compose up -d web
	@sleep 5
	@echo "Testing health endpoint..."
	@curl -f http://localhost:3000/ || echo "❌ Health check failed"
	@echo "✅ Basic connectivity test completed"
	docker compose down

# Clean up everything
clean:
	docker compose --profile dev down -v --remove-orphans
	docker system prune -f
	@echo "🧹 Cleaned up containers, images, and volumes"

# Rebuild everything from scratch
rebuild: clean
	docker compose build --no-cache web
	@echo "🔨 Complete rebuild finished"

# Quick development cycle
quick-dev: down dev

# Quick production cycle
quick-prod: down up
