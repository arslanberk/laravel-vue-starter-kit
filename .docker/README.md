# Docker Development Environment Setup

This Docker setup provides a complete development environment for the Laravel application with production parity.

## Architecture Overview

The setup includes:
- **nginx**: Web server serving the Laravel SPA and proxying API requests
- **app**: PHP-FPM container running Laravel backend
- **frontend**: Node.js container running Vite in watch mode for asset compilation
- **postgres**: PostgreSQL database
- **redis**: Redis for caching and sessions
- **mailpit**: Email testing server

## Key Features

✅ **Production Parity**: Same architecture as production (nginx + PHP-FPM + built assets)
✅ **No CORS Issues**: Everything served from same origin (localhost:80)
✅ **Vite Watch Mode**: Assets rebuild automatically on changes
✅ **User Permission Matching**: No file permission issues
✅ **Consistent Development**: Works the same across all browsers

## Setup Instructions

### 1. Copy Environment File
```bash
cp .docker/docker.env.example .env
```

### 2. Update UID/GID (macOS/Linux)
Check your user ID and group ID:
```bash
id
```

Update the `.env` file with your actual UID and GID:
```env
WWWUSER=501  # Your UID
WWWGROUP=20  # Your GID
```

### 3. Start and Setup
```bash
# Start containers
make start

# Generate Laravel app key
make run php artisan key:generate

# Run database migrations
make migrate
```

### 4. Access the Application
- **Application**: http://localhost
- **Mailpit Dashboard**: http://localhost:8025
- **Database**: localhost:5432 (postgres/secret)
- **Redis**: localhost:6379

### 5. View Available Commands
```bash
# See all available make commands with descriptions
make help
```

## Development Workflow

### Asset Development
- Frontend container automatically installs npm packages and watches for changes
- Vite compiles assets to `public/build/` on file changes
- Nginx serves compiled assets
- No hot reload server needed

### Laravel Development
- App container automatically installs composer packages on startup
- Make changes to PHP files
- PHP-FPM automatically picks up changes
- No container restarts needed

### Common Development Commands
```bash
# Container management
make start               # Start all containers
make stop                # Stop all containers
make restart             # Restart all containers
make rebuild             # Rebuild and start containers

# Database operations
make migrate             # Run migrations
make seed                # Seed database
make migrate-seed        # Run migrations and seed
make migrate-fresh       # Drop all tables and re-run migrations

# Create new Laravel resources
make run php artisan make:migration create_something_table
make run php artisan make:model ModelName
make run php artisan make:controller ControllerName

# Cache management
make cache-clear         # Clear Laravel caches
make redis-clear         # Clear Redis cache

# Development tools
make tinker              # Open Laravel Tinker REPL
make shell               # Open shell in app container
make logs                # View all container logs
make logs-app            # View app container logs only
make status              # Show application status and URLs
```

## Troubleshooting

### Permission Issues
If you encounter permission issues:
1. Check your UID/GID with `id`
2. Update `.env` with correct WWWUSER/WWWGROUP
3. Rebuild containers: `make rebuild`

### Container Issues
```bash
# View logs
make logs                # All container logs
make logs-app            # App container only
make logs-nginx          # Nginx container only
make logs-frontend       # Frontend container only

# Container management
make restart             # Restart all containers
make rebuild             # Rebuild all containers
make status              # Check container status
```

### Database Issues
```bash
# Reset database
make run php artisan migrate:refresh

# Fresh migration (drop all tables)
make migrate-fresh

# Check database connection
make tinker
>>> DB::connection()->getPdo();
```

### Asset Issues
```bash
# Check if assets are being compiled
make logs-frontend

# Manually build assets
make build

# Clear compiled assets
rm -rf public/build/*
```

## Container Management

### Start/Stop Services
```bash
# Start all services
make start

# Stop all services
make stop

# Stop and remove volumes (⚠️ deletes database data)
make clean

# Restart all services
make restart
```

### Execute Commands
```bash
# Laravel commands
make run php artisan [command]

# Composer commands
make run composer [command]

# NPM commands (using frontend container)
make npm-install         # Install npm packages
make npm-update          # Update npm packages
make build               # Build assets for production

# Direct shell access
make shell               # App container shell
make shell-frontend      # Frontend container shell
make tinker              # Laravel Tinker REPL
```

## Environment Variables

Key environment variables in `.env`:

```env
# Docker user matching
WWWUSER=501
WWWGROUP=20

# Application access
APP_URL=http://localhost
APP_PORT=80

# Database connection
DB_HOST=postgres
DB_DATABASE=laravel
DB_USERNAME=postgres
DB_PASSWORD=secret

# Cache/Session
CACHE_STORE=redis
SESSION_DRIVER=redis
REDIS_HOST=redis

# Email testing
MAIL_HOST=mailpit
MAIL_PORT=1025
```

## Production Considerations

This setup is designed for development but provides production parity:

### For Production:
1. Use production Docker images (not local.Dockerfile)
2. Set `NODE_ENV=production`
3. Run `npm run build` once (no watch mode)
4. Use production-grade database setup
5. Configure proper SSL certificates
6. Set appropriate environment variables

### Security Notes:
- Never expose database ports in production
- Use strong passwords and secrets
- Configure proper firewall rules
- Enable HTTPS/SSL certificates

## File Structure

```
.docker/
├── app/
│   ├── local.Dockerfile      # PHP-FPM container
│   ├── local.php.ini         # PHP configuration
│   └── local.opcache.ini     # OPcache settings (disabled for dev)
├── frontend/
│   └── local.Dockerfile      # Node.js container for Vite
├── nginx/
│   ├── local.Dockerfile      # Nginx container
│   └── local.nginx.conf      # Nginx configuration
├── postgres/
│   └── init.sql              # Database initialization
└── docker.env.example       # Environment variables template
```

## Common Commands

```bash
# Full reset (⚠️ loses all data)
make reset

# Update dependencies
make composer-update
make npm-update

# Run tests
make test
make test-coverage

# Development workflow
make start               # Start development
make stop                # Stop development
make status              # Check status

# Quick Laravel commands
make migrate             # Run migrations
make seed                # Seed database
make cache-clear         # Clear caches
make tinker              # Open Tinker REPL

# Get help
make help                # Show all available commands
```

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review container logs: `make logs` or `make logs-[service]`
3. Ensure your `.env` file has correct UID/GID values
4. Try rebuilding containers: `make rebuild`
5. For complete reset: `make reset`
6. View all available commands: `make help` 