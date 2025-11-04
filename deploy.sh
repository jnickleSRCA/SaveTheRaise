#!/bin/bash

# SaveTheRaise Deployment Script for ubuntu02

set -e

echo "🚀 Deploying SaveTheRaise to ubuntu02..."

# Configuration
DEPLOY_USER=${DEPLOY_USER:-"ubuntu"}
DEPLOY_HOST=${DEPLOY_HOST:-"ubuntu02"}
DEPLOY_PATH=${DEPLOY_PATH:-"/opt/SaveTheRaise"}
PROJECT_NAME="savetheraise"

echo "📦 Building Docker images..."
docker-compose build

echo "💾 Saving Docker images..."
docker save ${PROJECT_NAME}-api:latest | gzip > api-image.tar.gz
docker save ${PROJECT_NAME}-web:latest | gzip > web-image.tar.gz

echo "📤 Copying files to ubuntu02..."
ssh ${DEPLOY_USER}@${DEPLOY_HOST} "mkdir -p ${DEPLOY_PATH}"

# Copy Docker images
scp api-image.tar.gz web-image.tar.gz ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/

# Copy docker-compose.yml and .env
scp docker-compose.yml ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/
scp .env.example ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/

echo "🔧 Setting up on ubuntu02..."
ssh ${DEPLOY_USER}@${DEPLOY_HOST} << 'EOF'
cd ${DEPLOY_PATH}

# Load Docker images
echo "Loading Docker images..."
docker load < api-image.tar.gz
docker load < web-image.tar.gz

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with production values"
fi

# Stop existing containers
echo "Stopping existing containers..."
docker-compose down

# Start containers
echo "Starting containers..."
docker-compose up -d

# Show logs
echo "Deployment complete! Showing logs..."
docker-compose logs -f

EOF

# Cleanup
rm api-image.tar.gz web-image.tar.gz

echo "✅ Deployment complete!"
echo "Access the application at:"
echo "  - Web: http://ubuntu02:3000"
echo "  - API: http://ubuntu02:3001"
