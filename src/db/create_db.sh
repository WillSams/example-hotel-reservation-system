#!/bin/bash

docker-compose down && docker-compose up -d

# Check if the database already exists
CHECK_DB="PGPASSWORD=$DB_PASSWD psql -h 0.0.0.0 -U $DB_USER -p $DB_PORT -lqt"
DB_NAME=hotel_$NODE_ENV

if $(eval "$CHECK_DB" | cut -d \| -f 1 | grep -qw "$DB_NAME"); then
  echo "Database $DB_NAME already exists. Skipping creation."
else
  # Continue with your regular entrypoint logic
  # echo "Creating database $POSTGRES_DB..."
  PGPASSWORD=$DB_PASSWD psql \
    -h 0.0.0.0 \
    -p $DB_PORT \
    -U "$DB_USER" \
    -c "CREATE DATABASE $DB_NAME;"
fi


