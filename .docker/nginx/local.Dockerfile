FROM nginx:alpine

# Build arguments for user management
ARG WWWUSER=1000
ARG WWWGROUP=1000

# Set timezone
ENV TZ=UTC

# Install system dependencies
RUN apk add --no-cache \
    curl \
    shadow

# Update nginx user UID and GID to match host (handle existing groups)
RUN EXISTING_GROUP=$(getent group $WWWGROUP | cut -d: -f1) && \
    if [ -z "$EXISTING_GROUP" ]; then \
        groupmod -g $WWWGROUP nginx; \
        GROUP_NAME="nginx"; \
    else \
        GROUP_NAME="$EXISTING_GROUP"; \
        usermod -G $GROUP_NAME nginx; \
    fi && \
    usermod -u $WWWUSER nginx

# Copy nginx configuration
COPY local.nginx.conf /etc/nginx/conf.d/default.conf

# Create necessary directories
RUN mkdir -p /var/log/nginx /var/cache/nginx && \
    EXISTING_GROUP=$(getent group $WWWGROUP | cut -d: -f1) && \
    if [ -z "$EXISTING_GROUP" ]; then \
        GROUP_NAME="nginx"; \
    else \
        GROUP_NAME="$EXISTING_GROUP"; \
    fi && \
    chown -R nginx:$GROUP_NAME /var/log/nginx /var/cache/nginx

# Set working directory
WORKDIR /var/www/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 