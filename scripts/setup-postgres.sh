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

# Check if PostgreSQL container is already running
if docker ps -q -f name=${CONTAINER_NAME} --format "{{.Names}}" &>/dev/null; then
    echo "PostgreSQL container '${CONTAINER_NAME}' is already running."
else
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
    echo "Waiting for PostgreSQL to initialize (this may take a moment)..."
    # It's good practice to wait for the service to be ready.
    # A simple sleep is often sufficient for local dev, but a more robust check might inspect container logs.
    sleep 15
fi

# Construct the DATABASE_URL
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${HOST_PORT}/${POSTGRES_DB}"

# Create or update the .env file
echo "${DATABASE_URL}" > .env
echo "Created/Updated .env file with DATABASE_URL: ${DATABASE_URL}"

echo "--- Docker setup complete ---"
echo "PostgreSQL container '${CONTAINER_NAME}' is running."
echo "Your DATABASE_URL is saved in the .env file."

exit 0
