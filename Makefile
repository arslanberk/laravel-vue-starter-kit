# Laravel - Development Makefile
# =====================================================

# Default target
.DEFAULT_GOAL := help

# Docker Compose file
COMPOSE_FILE := docker-compose.local.yml

# Colors for output
BLUE := \033[36m
GREEN := \033[32m
YELLOW := \033[33m
RED := \033[31m
RESET := \033[0m

# Help target
.PHONY: help
help: ## Show this help message
	@echo "$(BLUE)Laravel - Development Commands$(RESET)"
	@echo "$(BLUE)=====================================================$(RESET)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Examples:$(RESET)"
	@echo "  make start                           # Start all containers"
	@echo "  make run php artisan migrate         # Run database migrations"
	@echo "  make run php artisan db:seed         # Seed database"
	@echo "  make run php artisan make:migration create_users_table"
	@echo "  make run composer install            # Install PHP dependencies"
	@echo "  make run php artisan tinker          # Open Laravel tinker"
	@echo ""
	@echo "$(YELLOW)Quick Start:$(RESET)"
	@echo "  1. Copy environment file: cp .docker/docker.env.example .env"
	@echo "  2. Update WWWUSER/WWWGROUP in .env with your UID/GID"
	@echo "  3. make start                        # Start containers"
	@echo "  4. make run php artisan key:generate # Generate app key"
	@echo "  5. make migrate                      # Run migrations"
	@echo ""


# Container management
.PHONY: start
start: ## Start all development containers
	@echo "$(BLUE)Starting development containers...$(RESET)"
	@docker-compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)✅ Containers started$(RESET)"
	@echo "$(YELLOW)Use 'make logs' to view container logs$(RESET)"

.PHONY: stop
stop: ## Stop all development containers
	@echo "$(BLUE)Stopping development containers...$(RESET)"
	@docker-compose -f $(COMPOSE_FILE) down
	@echo "$(GREEN)✅ Containers stopped$(RESET)"

.PHONY: restart
restart: ## Restart all development containers
	@echo "$(BLUE)Restarting development containers...$(RESET)"
	@docker-compose -f $(COMPOSE_FILE) restart
	@echo "$(GREEN)✅ Containers restarted$(RESET)"

.PHONY: rebuild
rebuild: ## Rebuild and start all containers (useful after Dockerfile changes)
	@echo "$(BLUE)Rebuilding containers...$(RESET)"
	@docker-compose -f $(COMPOSE_FILE) down
	@docker-compose -f $(COMPOSE_FILE) up -d --build
	@echo "$(GREEN)✅ Containers rebuilt and started$(RESET)"

# Command execution
.PHONY: run
run: ## Run command in app container (e.g., make run php artisan migrate)
	@if [ -z "$(filter-out $@,$(MAKECMDGOALS))" ]; then \
		echo "$(RED)Error: Please provide a command to run$(RESET)"; \
		echo "$(YELLOW)Example: make run php artisan migrate$(RESET)"; \
		exit 1; \
	fi
	@docker-compose -f $(COMPOSE_FILE) exec app $(filter-out $@,$(MAKECMDGOALS))

# Prevent make from treating command arguments as targets
%:
	@:

# Logging and monitoring
.PHONY: logs
logs: ## Show logs from all containers
	@docker-compose -f $(COMPOSE_FILE) logs -f

.PHONY: logs-app
logs-app: ## Show logs from app container only
	@docker-compose -f $(COMPOSE_FILE) logs -f app

.PHONY: logs-nginx
logs-nginx: ## Show logs from nginx container only
	@docker-compose -f $(COMPOSE_FILE) logs -f nginx

.PHONY: logs-frontend
logs-frontend: ## Show logs from frontend container only
	@docker-compose -f $(COMPOSE_FILE) logs -f frontend

.PHONY: ps
ps: ## Show running containers
	@docker-compose -f $(COMPOSE_FILE) ps

# Database operations
.PHONY: migrate
migrate: ## Run database migrations
	@echo "$(BLUE)Running database migrations...$(RESET)"
	@$(MAKE) run php artisan migrate
	@echo "$(GREEN)✅ Migrations completed$(RESET)"

.PHONY: migrate-fresh
migrate-fresh: ## Drop all tables and re-run migrations
	@echo "$(BLUE)Dropping all tables and re-running migrations...$(RESET)"
	@$(MAKE) run php artisan migrate:fresh
	@echo "$(GREEN)✅ Fresh migrations completed$(RESET)"

.PHONY: seed
seed: ## Seed the database
	@echo "$(BLUE)Seeding database...$(RESET)"
	@$(MAKE) run php artisan db:seed
	@echo "$(GREEN)✅ Database seeded$(RESET)"

.PHONY: migrate-seed
migrate-seed: ## Run migrations and seed database
	@$(MAKE) migrate
	@$(MAKE) seed

# Cache management
.PHONY: cache-clear
cache-clear: ## Clear all Laravel caches
	@echo "$(BLUE)Clearing Laravel caches...$(RESET)"
	@$(MAKE) run php artisan config:clear
	@$(MAKE) run php artisan cache:clear
	@$(MAKE) run php artisan route:clear
	@$(MAKE) run php artisan view:clear
	@echo "$(GREEN)✅ Caches cleared$(RESET)"

.PHONY: redis-clear
redis-clear: ## Clear Redis cache
	@echo "$(BLUE)Clearing Redis cache...$(RESET)"
	@docker-compose -f $(COMPOSE_FILE) exec redis redis-cli FLUSHALL
	@echo "$(GREEN)✅ Redis cache cleared$(RESET)"

# Development tools
.PHONY: tinker
tinker: ## Open Laravel Tinker REPL
	@$(MAKE) run php artisan tinker

.PHONY: shell
shell: ## Open shell in app container
	@docker-compose -f $(COMPOSE_FILE) exec app /bin/sh

.PHONY: shell-frontend
shell-frontend: ## Open shell in frontend container
	@docker-compose -f $(COMPOSE_FILE) exec frontend /bin/sh

.PHONY: shell-nginx
shell-nginx: ## Open shell in nginx container
	@docker-compose -f $(COMPOSE_FILE) exec nginx /bin/sh

# Composer and NPM
.PHONY: composer-install
composer-install: ## Install PHP dependencies
	@echo "$(BLUE)Installing PHP dependencies...$(RESET)"
	@$(MAKE) run composer install
	@echo "$(GREEN)✅ PHP dependencies installed$(RESET)"

.PHONY: composer-update
composer-update: ## Update PHP dependencies
	@echo "$(BLUE)Updating PHP dependencies...$(RESET)"
	@$(MAKE) run composer update
	@echo "$(GREEN)✅ PHP dependencies updated$(RESET)"

.PHONY: npm-install
npm-install: ## Install Node.js dependencies
	@echo "$(BLUE)Installing Node.js dependencies...$(RESET)"
	@docker-compose -f $(COMPOSE_FILE) exec frontend npm install
	@echo "$(GREEN)✅ Node.js dependencies installed$(RESET)"

.PHONY: npm-update
npm-update: ## Update Node.js dependencies
	@echo "$(BLUE)Updating Node.js dependencies...$(RESET)"
	@docker-compose -f $(COMPOSE_FILE) exec frontend npm update
	@echo "$(GREEN)✅ Node.js dependencies updated$(RESET)"

# Asset management
.PHONY: build
build: ## Build frontend assets for production
	@echo "$(BLUE)Building frontend assets...$(RESET)"
	@docker-compose -f $(COMPOSE_FILE) exec frontend npm run build
	@echo "$(GREEN)✅ Assets built$(RESET)"

# Testing
.PHONY: test
test: ## Run PHP tests
	@echo "$(BLUE)Running PHP tests...$(RESET)"
	@$(MAKE) run php artisan test
	@echo "$(GREEN)✅ Tests completed$(RESET)"

.PHONY: test-coverage
test-coverage: ## Run PHP tests with coverage
	@echo "$(BLUE)Running PHP tests with coverage...$(RESET)"
	@$(MAKE) run php artisan test --coverage
	@echo "$(GREEN)✅ Tests with coverage completed$(RESET)"

# Cleanup
.PHONY: clean
clean: ## Stop containers and remove volumes (⚠️  destroys all data)
	@echo "$(RED)⚠️  This will destroy all data including database!$(RESET)"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	@docker-compose -f $(COMPOSE_FILE) down -v
	@echo "$(GREEN)✅ Containers stopped and volumes removed$(RESET)"

.PHONY: reset
reset: ## Complete reset - stop, clean, and start fresh
	@$(MAKE) clean
	@echo "$(YELLOW)After reset, you'll need to:$(RESET)"
	@echo "  1. make start"
	@echo "  2. make run php artisan key:generate"
	@echo "  3. make migrate"

# Status and information
.PHONY: status
status: ## Show application status and URLs
	@echo "$(BLUE)Application Status$(RESET)"
	@echo "$(BLUE)=================$(RESET)"
	@echo "$(GREEN)📱 Application:$(RESET) http://localhost"
	@echo "$(GREEN)📧 Mailpit:$(RESET) http://localhost:8025"
	@echo "$(GREEN)🗄️  Database:$(RESET) localhost:5432 (postgres/secret)"
	@echo "$(GREEN)🔄 Redis:$(RESET) localhost:6379"
	@echo ""
	@echo "$(YELLOW)Container Status:$(RESET)"
	@$(MAKE) ps 