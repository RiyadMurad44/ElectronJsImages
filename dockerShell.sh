#!/bin/bash

echo "Waiting for MySQL to be ready..."

until mysqladmin ping -h"$LARAVEL_DATABASE_HOST" -P"$LARAVEL_DATABASE_PORT_NUMBER" -u"$LARAVEL_DATABASE_USER" -p"$LARAVEL_DATABASE_PASSWORD" --silent; do
  echo "Waiting for database..."
  sleep 5
done

echo "Database is ready."

# Generate .env if it doesn't exist
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Run Laravel setup
composer install --no-dev --optimize-autoloader
php artisan key:generate
php artisan migrate 

# Start Laravel server
php artisan serve --host=0.0.0.0 --port=8000
