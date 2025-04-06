FROM php:8.3-apache

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libonig-dev libxml2-dev zip curl \
    default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Laravel source code (to ensure all files like app/, bootstrap/, etc. exist)
COPY ./imagesElectron /var/www/html

# Install dependencies first to cache them
RUN composer install --no-dev --optimize-autoloader

# Copy Laravel application files
COPY ./imagesElectron /var/www/html

#Copy the entrypoint script into the image
COPY dockerShell.sh /usr/local/bin/dockerShell.sh

# Make the entrypoint script executable
RUN chmod +x /usr/local/bin/dockerShell.sh

# Expose port 8000
EXPOSE 8000

# Use custom entrypoint
ENTRYPOINT ["dockerShell.sh"]