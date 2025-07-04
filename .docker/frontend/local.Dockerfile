FROM node:20-alpine

# Build arguments for user management
ARG WWWUSER=1000
ARG WWWGROUP=1000

# Set timezone
ENV TZ=UTC

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl

# Create application user and group (handle existing groups)
RUN GROUP_NAME=$(getent group $WWWGROUP | cut -d: -f1) && \
    if [ -z "$GROUP_NAME" ]; then \
        addgroup -g $WWWGROUP appuser && GROUP_NAME="appuser"; \
    fi && \
    adduser -D -u $WWWUSER -G $GROUP_NAME appuser

# Set working directory
WORKDIR /var/www/html

# Fix ownership of working directory
RUN GROUP_NAME=$(getent group $WWWGROUP | cut -d: -f1) && \
    if [ -z "$GROUP_NAME" ]; then \
        GROUP_NAME="appuser"; \
    fi && \
    chown -R appuser:$GROUP_NAME /var/www/html

# Create entrypoint script to fix permissions
RUN echo '#!/bin/sh' > /usr/local/bin/fix-permissions.sh && \
    echo 'GROUP_NAME=$(getent group '$WWWGROUP' | cut -d: -f1)' >> /usr/local/bin/fix-permissions.sh && \
    echo 'if [ -z "$GROUP_NAME" ]; then GROUP_NAME="appuser"; fi' >> /usr/local/bin/fix-permissions.sh && \
    echo 'chown -R appuser:$GROUP_NAME /var/www/html/node_modules 2>/dev/null || true' >> /usr/local/bin/fix-permissions.sh && \
    echo 'exec su-exec appuser "$@"' >> /usr/local/bin/fix-permissions.sh && \
    chmod +x /usr/local/bin/fix-permissions.sh

# Install su-exec for secure user switching
RUN apk add --no-cache su-exec

# Use the script as entrypoint
ENTRYPOINT ["/usr/local/bin/fix-permissions.sh"]

# Default command (will be overridden in docker-compose)
CMD ["npm", "run", "build", "--", "--watch"] 