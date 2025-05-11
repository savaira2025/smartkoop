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

# Start the server in the background
echo "Starting the server in the background..."
python run.py &
SERVER_PID=$!

# Wait for the server to start (give it 5 seconds)
echo "Waiting for the server to start..."
sleep 5

# Run the test script
echo "Running the test script..."
python test_create_orders.py

# Capture the test result
TEST_RESULT=$?

# Kill the server process
echo "Shutting down the server..."
kill $SERVER_PID

# Exit with the test result
exit $TEST_RESULT
