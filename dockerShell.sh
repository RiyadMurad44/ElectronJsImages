#!/bin/bash

echo "➡️  Waiting for MySQL to be ready..."

until mysqladmin ping -h"$LARAVEL_DATABASE_HOST" -P"$LARAVEL_DATABASE_PORT_NUMBER" -u"$LARAVEL_DATABASE_USER" -p"$LARAVEL_DATABASE_PASSWORD" --silent; do
  echo "⏳ Waiting for database..."
  sleep 5
done

echo "✅ Database is ready."

if [ ! -f .env ]; then
  echo "📝 .env not found, creating from .env.example"
  cp .env.example .env
  php artisan key:generate

  # Inject the values from environment variables into .env
  echo "Injecting environment variables into .env"

  # Update DB values in .env
  sed -i "s|DB_HOST=.*|DB_HOST=${LARAVEL_DATABASE_HOST}|" .env
  sed -i "s|DB_PORT=.*|DB_PORT=${LARAVEL_DATABASE_PORT_NUMBER}|" .env
  sed -i "s|DB_DATABASE=.*|DB_DATABASE=${LARAVEL_DATABASE_NAME}|" .env
  sed -i "s|DB_USERNAME=.*|DB_USERNAME=${LARAVEL_DATABASE_USER}|" .env
  sed -i "s|DB_PASSWORD=.*|DB_PASSWORD=${LARAVEL_DATABASE_PASSWORD}|" .env
else
  echo "📄 .env already exists"
fi

echo "⚙️  Running Laravel config cache"
php artisan config:cache

echo "📦 Running Laravel migrations"
php artisan migrate --force

echo "🚀 Starting Apache..."
apache2-foreground
