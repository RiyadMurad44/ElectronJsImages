FROM php:8.3-apache

# Set working directory
WORKDIR /var/www/html

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libonig-dev libxml2-dev zip curl \
    default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql zip \
    #Clean up apt caches to keep the image size small
    && apt-get clean && rm -rf /var/lib/apt/lists/* 

# Enable Apache mod_rewrite
RUN a2enmod rewrite \
    && sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf \
    && sed -i 's|<Directory /var/www/html>|<Directory /var/www/html/public>|g' /etc/apache2/apache2.conf

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy Laravel project files
COPY ./imagesElectron /var/www/html

# Copy only composer.json and composer.lock first to leverage Docker cache (Recently Changed)
# COPY ./imagesElectron/composer.json ./composer.json
# COPY ./imagesElectron/composer.lock ./composer.lock

# Install Composer dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy the application (Also new)
# COPY ./imagesElectron /var/www/html

# Set permissions for storage and bootstrap/cache directories
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Copy the entrypoint script into the image path where all the globally executed scripts are located
COPY dockerShell.sh /usr/local/bin/dockerShell.sh

# Make the entrypoint script executable
RUN chmod +x /usr/local/bin/dockerShell.sh

# Expose port 80
EXPOSE 80

# Use custom entrypoint
ENTRYPOINT ["dockerShell.sh"]
