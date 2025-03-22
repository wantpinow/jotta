#!/bin/bash
# Use this script to start a docker container for a local development database

DB_CONTAINER_NAME="$DATABASE_NAME-postgres"

# Check if the database container is already running
if [ "$(docker ps -q -f name=$DB_CONTAINER_NAME)" ]; then
    echo "Database container '$DB_CONTAINER_NAME' already running"
    exit 0
fi

# Check if the database container exists and start it if it does
if [ "$(docker ps -q -a -f name=$DB_CONTAINER_NAME)" ]; then
    docker start "$DB_CONTAINER_NAME"
    echo "Existing database container '$DB_CONTAINER_NAME' started"
    exit 0
fi

# Create the database container
echo "Creating database container '$DB_CONTAINER_NAME'"
docker run -d \
--name $DB_CONTAINER_NAME \
-e POSTGRES_PASSWORD="$DATABASE_PASSWORD" \
-e POSTGRES_DB=$DATABASE_NAME \
-p $DATABASE_PORT:5432 \
pgvector/pgvector:pg16 && echo "Database container '$DB_CONTAINER_NAME' was successfully created"
