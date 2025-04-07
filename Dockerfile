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
# RUN a2enmod rewrite

# Enable Apache mod_rewrite
RUN a2enmod rewrite \
    && sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|g' /etc/apache2/sites-available/000-default.conf \
    && sed -i 's|<Directory /var/www/html>|<Directory /var/www/html/public>|g' /etc/apache2/apache2.conf 

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy only composer files first (for layer caching)
# COPY ./imagesElectron/composer.json ./imagesElectron/composer.lock /var/www/html/

# Copy files from imagesElectron to the WORKDIR file in image
COPY ./imagesElectron /var/www/html

# Install dependencies first to cache them
RUN composer install --no-dev --optimize-autoloader

# Copy Laravel application files
COPY ./imagesElectron /var/www/html

#Copy the entrypoint script into the image
COPY dockerShell.sh /usr/local/bin/dockerShell.sh

# Make the entrypoint script executable
RUN chmod +x /usr/local/bin/dockerShell.sh

# Expose port 80
EXPOSE 80

# Use custom entrypoint
ENTRYPOINT ["dockerShell.sh"]