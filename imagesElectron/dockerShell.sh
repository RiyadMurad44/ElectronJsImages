#!/bin/bash

# if ! php artisan db:table sessions > /dev/null 2>&1; then
#   echo "Migrating..."
#   php artisan migrate
# fi

php artisan migrate

php artisan serve --host=0.0.0.0 --port=8000
