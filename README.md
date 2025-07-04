# Laravel Vue Starter Kit

> A modern, production-ready Laravel + Vue.js SPA starter kit with authentication, Docker setup, and clean architecture - **No Inertia, No Livewire** 🚀

## 🎯 Why This Project Exists

Many developers love Laravel but don't want to learn framework-specific solutions like **Inertia.js** or **Livewire**. This starter kit provides:

- ✅ **Pure Laravel API** + **Pure Vue.js SPA** approach
- ✅ **Latest Laravel features** (Fortify, Sanctum) without the learning curve of new frameworks
- ✅ **Production-ready Docker setup** that can be easily adapted for deployment
- ✅ **Complete authentication system** with 2FA, email verification, and password reset
- ✅ **Modern UI components** with shadcn-vue and Tailwind CSS
- ✅ **Free and open-source** - no vendor lock-in

**Perfect for developers who want to stick with familiar technologies while leveraging modern Laravel capabilities.**

## 🛠 Tech Stack

| Technology | Version | Purpose | Official Link |
|------------|---------|---------|---------------|
| **Laravel** | 12.x | Backend API & Authentication | [laravel.com](https://laravel.com) |
| **Vue.js** | 3.x | Frontend SPA Framework | [vuejs.org](https://vuejs.org) |
| **Laravel Fortify** | Latest | Authentication Backend | [laravel.com/docs/fortify](https://laravel.com/docs/fortify) |
| **Laravel Sanctum** | Latest | SPA Authentication | [laravel.com/docs/sanctum](https://laravel.com/docs/sanctum) |
| **shadcn-vue** | Latest | Modern UI Components | [shadcn-vue.com](https://www.shadcn-vue.com) |
| **Tailwind CSS** | Latest | Utility-First CSS | [tailwindcss.com](https://tailwindcss.com) |
| **VueUse** | Latest | Vue Composition Utilities | [vueuse.org](https://vueuse.org) |
| **Docker** | Latest | Development Environment | [docker.com](https://docker.com) |
| **Nginx** | Latest | Web Server & Reverse Proxy | [nginx.org](https://nginx.org) |

> **🚫 What we DON'T use:** Inertia.js, Livewire, or any proprietary solutions that require learning new paradigms.

## 📸 Screenshots

### Landing Page (Dark/Light Mode)
![Landing Dark](.docs/landing-dark.png) ![Landing Light](.docs/landing-light.png)

### Authentication Pages
![Login](.docs/login.png) ![Register](.docs/register.png)

### Dashboard & Settings
![Dashboard](.docs/dashboard-skeleton.png) ![Settings](.docs/settings-overview.png)

### Two-Factor Authentication Setup
![Two Factor Setup](.docs/two-factor-setup.png)

## 📁 Project Structure

```
laravel-vue-starter-kit/
├── .docker/                    # Docker configuration files
│   ├── docker.env.example     # Environment variables for Docker
│   ├── README.md              # Docker setup documentation
│   └── postgres/              # PostgreSQL initialization
├── .docs/                     # Project documentation & screenshots
├── app/                       # Laravel application logic
│   ├── Actions/Fortify/       # Custom Fortify actions
│   ├── Http/Controllers/      # API controllers
│   └── Models/                # Eloquent models
├── resources/
│   ├── js/                    # Vue.js application
│   │   ├── features/          # Feature-based organization
│   │   │   ├── auth/          # Authentication (login, register, etc.)
│   │   │   ├── dashboard/     # User dashboard
│   │   │   ├── settings/      # User settings & profile
│   │   │   └── landing/       # Landing page & legal pages
│   │   ├── shared/            # Shared components & utilities
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── composables/   # Vue composables
│   │   │   ├── lib/           # Utilities & configurations
│   │   │   └── stores/        # Pinia stores
│   │   └── app.js             # Main Vue application entry
│   ├── css/                   # Tailwind CSS & global styles
│   └── views/                 # Laravel Blade templates (minimal)
├── routes/
│   ├── api.php                # API routes
│   └── web.php                # Web routes (SPA fallback)
├── docker-compose.local.yml   # Docker services for development
├── Makefile                   # Development shortcuts & commands
└── README.md                  # This file
```

## 🚀 Installation & Setup

### Prerequisites

- **Docker** & **Docker Compose** (recommended)
- **OR** PHP 8.2+, Node.js 18+, Composer, npm/yarn (for local development)

### 📋 Step 1: Clone the Repository

```bash
git clone https://github.com/arslanberk/laravel-vue-starter-kit.git
cd laravel-vue-starter-kit
```

### 📋 Step 2: Configure Environment

```bash
cp .env.example .env
```

### 📋 Step 3: Set User Permissions (Important!)

To prevent file permission issues, you need to set your user ID and group ID in the `.env` file:

#### 🐧 Linux / 🍎 macOS:
```bash
# Find your UID and GID
id

# Add these to your .env file
WWWUSER=1000    # Replace with your UID
WWWGROUP=1000   # Replace with your GID
```

#### 🪟 Windows (WSL2):
```bash
# In WSL2 terminal
id

# Add these to your .env file
WWWUSER=1000    # Replace with your UID  
WWWGROUP=1000   # Replace with your GID
```

#### 🪟 Windows (Docker Desktop):
```bash
# Usually can use default values
WWWUSER=1000
WWWGROUP=1000
```

> **Why is this important?** Docker containers run as specific users. If the container user doesn't match your host user, you'll get permission denied errors when the container tries to write files.

### 📋 Step 4: Start the Application

```bash
# Start all containers
make start

# Generate application key
make run php artisan key:generate

# Run database migrations
make migrate

# (Optional) Seed the database with sample data
make seed
```

### 📋 Step 5: Access Your Application

- **🌐 Application:** http://localhost
- **📧 Mailpit (Email testing):** http://localhost:8025
- **🗄️ Database:** localhost:5432 (postgres/secret)

## 🛠 Makefile Commands

The project includes a `Makefile` with convenient shortcuts for common development tasks:

### 🔧 Container Management
```bash
make start          # Start all containers
make stop           # Stop all containers  
make restart        # Restart all containers
make rebuild        # Rebuild containers (after Dockerfile changes)
make ps             # Show running containers
make status         # Show application URLs and status
```

### 🗄️ Database Operations
```bash
make migrate        # Run database migrations
make migrate-fresh  # Drop all tables and re-run migrations
make seed           # Seed the database
make migrate-seed   # Run migrations and seed database
```

### 🧹 Cache Management
```bash
make cache-clear    # Clear all Laravel caches
make redis-clear    # Clear Redis cache
```

### 🔨 Development Tools
```bash
make shell          # Open shell in app container
make shell-frontend # Open shell in frontend container
make tinker         # Open Laravel Tinker REPL
make logs           # Show logs from all containers
make logs-app       # Show logs from app container only
```

### 📦 Dependencies & Assets
```bash
make composer-install  # Install PHP dependencies
make composer-update   # Update PHP dependencies
make npm-install       # Install Node.js dependencies
make npm-update        # Update Node.js dependencies
make build            # Build frontend assets for production
```

### 🧪 Testing
```bash
make test           # Run PHP tests
make test-coverage  # Run PHP tests with coverage
```

### 🗑️ Cleanup
```bash
make clean          # Stop containers and remove volumes (⚠️ destroys data!)
make reset          # Complete reset - clean and restart fresh
```

### 💡 Running Custom Commands

You can run any command inside the app container:

```bash
# Examples:
make run php artisan migrate:status
make run php artisan make:controller ApiController
make run composer require package/name
make run php artisan route:list
make run php artisan queue:work
```

## 🎨 Customization

### 🎯 Branding
- Update app name in `config/app.php`
- Modify the `ApplicationLogo` component in `resources/js/shared/components/common/`
- Customize colors in `tailwind.config.js`

### 🔧 Features
- Add new features in `resources/js/features/`
- Follow the existing pattern: pages, components, composables, stores
- API routes go in `routes/api.php`

### 🎨 Styling
- Modify Tailwind configuration in `tailwind.config.js`
- Global styles in `resources/css/app.css`
- Component styles using Tailwind utility classes

## 🌐 Production Deployment

This starter kit is designed to be production-ready:

1. **Build assets:** `make build`
2. **Set environment:** Update `.env` for production
3. **Database:** Run migrations on production database
4. **Web server:** Use the nginx configuration as a base
5. **Process manager:** Set up supervisord or similar for queue workers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `make test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 🆘 Getting Help

- **Issues:** [GitHub Issues](https://github.com/arslanberk/laravel-vue-starter-kit/issues)
- **Discussions:** [GitHub Discussions](https://github.com/arslanberk/laravel-vue-starter-kit/discussions)
- **Laravel Docs:** [laravel.com/docs](https://laravel.com/docs)
- **Vue.js Docs:** [vuejs.org/guide](https://vuejs.org/guide/)
- **VueUse Guide:** [vueuse.org/guide](https://vueuse.org/guide/)

---

**Made with ❤️ for developers who love Laravel + Vue.js without the complexity of learning new frameworks.**
