#!/bin/bash
# Check if the URL parameter is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <url>"
  exit 1
fi


frontend_url="$1"
backend_url=$(echo "$frontend_url" | sed 's/8000/3060/')
sentiment_analyzer_url=$(echo "$frontend_url" | sed 's/8000/3000/')


echo "MONGO_USER=root" > .env
echo "MONGO_PASS=olw92tWUWVCEqHVDUSy9hxoB" >> .env
echo "MONGO_URL=mongodb://root:olw92tWUWVCEqHVDUSy9hxoB@mongodb-service:27017" >> .env

echo "REACT_APP_BACKEND_URL=$backend_url" > ./secondChance-frontend/.env

echo "JWT_SECRET=bV7fm7hVRYpzVZiw4CrVw1pM" > ./secondChance-backend/.env
echo "MONGO_DB=secondChance" >> ./secondChance-backend/.env
echo "MONGO_COLLECTION=secondChanceItems" >> ./secondChance-backend/.env


cd ./secondChance-frontend
docker build -f ./Dockerfile .. -t secondchance-frontend
cd ..

cd ./secondChance-backend
docker build . -t secondchance-backend
cd ..

cd sentiment
docker build . -t sentiment
cd ..


docker compose up -d