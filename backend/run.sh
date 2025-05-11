#!/bin/bash

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
  echo "Creating virtual environment..."
  /Users/iimran/.pyenv/versions/3.10.12/bin/python3.10 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

echo "Dependencies installed successfully."

# Initialize the database
echo "Initializing the database..."
python init_data.py

# Start the server
echo "Starting the server..."
python run.py
