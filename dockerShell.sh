#!/bin/bash

echo "➡️  Waiting for MySQL to be ready..."

until mysqladmin ping -h"$LARAVEL_DATABASE_HOST" -P"$LARAVEL_DATABASE_PORT_NUMBER" -u"$LARAVEL_DATABASE_USER" -p"$LARAVEL_DATABASE_PASSWORD" --silent; do
  echo "⏳ Waiting for database..."
  sleep 5
done

echo "✅ Database is ready."

# Check for .env
if [ ! -f .env ]; then
  echo "📝 .env not found, creating from .env.example"
  cp .env.example .env
  php artisan key:generate
else
  echo "📄 .env already exists"
fi

echo "⚙️  Running Laravel config cache"
php artisan config:cache

echo "📦 Running Laravel migrations"
php artisan migrate --force

echo "🚀 Starting Apache..."
apache2-foreground
