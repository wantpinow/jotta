#!/usr/bin/env bash

# delete the database container (also deletes the data)
docker rm -f $DATABASE_NAME-postgres

echo "Database container '$DATABASE_NAME-postgres' was successfully deleted"