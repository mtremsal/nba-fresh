#!/bin/bash

# Create data directory if it doesn't exist
mkdir -p data

# Download the database zip file
echo "Downloading NBA database..."
curl -L -o ./data/basketball.zip \
  https://www.kaggle.com/api/v1/datasets/download/wyattowalsh/basketball

# Unzip the database file
echo "Extracting database..."
cd data
unzip -o basketball.zip
mv ./nba.sqlite ./prod-database.sqlite

# Clean up
rm basketball.zip
rm -rf csv

echo "Database successfully downloaded and extracted to data/prod-database.sqlite"