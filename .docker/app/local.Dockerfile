FROM php:8.3-fpm-alpine

# Build arguments for user management
ARG WWWUSER=1000
ARG WWWGROUP=1000

# Set timezone
ENV TZ=UTC

# Install system dependencies
RUN apk add --no-cache \
    curl \
    zip \
    unzip \
    git \
    oniguruma-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    postgresql-dev \
    icu-dev \
    autoconf \
    g++ \
    make \
    linux-headers

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        mbstring \
        zip \
        exif \
        pcntl \
        gd \
        intl \
        bcmath \
        opcache

# Install Redis extension
RUN pecl install redis \
    && docker-php-ext-enable redis

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && chmod +x /usr/local/bin/composer

# Create application user and group (handle existing groups)
RUN GROUP_NAME=$(getent group $WWWGROUP | cut -d: -f1) && \
    if [ -z "$GROUP_NAME" ]; then \
        addgroup -g $WWWGROUP appuser && GROUP_NAME="appuser"; \
    fi && \
    adduser -D -u $WWWUSER -G $GROUP_NAME appuser

# Set working directory
WORKDIR /var/www/html

# Copy PHP configuration files
COPY local.php.ini /usr/local/etc/php/php.ini
COPY local.opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Change ownership of directories
RUN GROUP_NAME=$(getent group $WWWGROUP | cut -d: -f1) && \
    if [ -z "$GROUP_NAME" ]; then \
        GROUP_NAME="appuser"; \
    fi && \
    chown -R appuser:$GROUP_NAME /var/run/ /var/www/html

# Switch to application user
USER appuser

# Expose PHP-FPM port
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"] 