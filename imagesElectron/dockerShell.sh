#!/bin/bash

if [ ! -f /app/.migrated ]; then
  php artisan migrate
  touch /app/.migrated
fi

php artisan serve --host=0.0.0.0 --port=8000