#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Define PostgreSQL container settings
CONTAINER_NAME="mtb16-postgres"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="mysecretpassword" # You can change this to your preferred password
POSTGRES_DB="mtb16_db"
HOST_PORT="5432"
CONTAINER_PORT="5432"

# Verify Docker is running
if ! docker info &>/dev/null; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start the PostgreSQL container
echo "Starting PostgreSQL container '${CONTAINER_NAME}'..."
docker run \
--name ${CONTAINER_NAME} \
-e POSTGRES_USER=${POSTGRES_USER} \
-e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
-e POSTGRES_DB=${POSTGRES_DB} \
-p ${HOST_PORT}:${CONTAINER_PORT} \
-d postgres:latest

echo "PostgreSQL container '${CONTAINER_NAME}' started."

# Construct the DATABASE_URL
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${HOST_PORT}/${POSTGRES_DB}"

echo "--- Docker setup complete ---"
echo "PostgreSQL container '${CONTAINER_NAME}' is running."
echo "You can connect to the database using the following DATABASE_URL:"
echo "${DATABASE_URL}"

exit 0
