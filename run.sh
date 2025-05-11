#!/bin/bash

# Function to display usage information
usage() {
  echo "Usage: $0 [backend|frontend|both]"
  echo "  backend  - Run only the backend server"
  echo "  frontend - Run only the frontend server"
  echo "  both     - Run both backend and frontend servers (default)"
  exit 1
}

# Function to run the backend server
run_backend() {
  echo "Starting backend server..."
  cd backend && ./run.sh
}

# Function to run the frontend server
run_frontend() {
  echo "Starting frontend server..."
  cd frontend && ./run.sh
}

# Function to run both servers
run_both() {
  # Start the backend server in the background
  echo "Starting backend server in the background..."
  cd backend && ./run.sh &
  BACKEND_PID=$!
  
  # Wait a moment for the backend to start
  sleep 5
  
  # Start the frontend server
  echo "Starting frontend server..."
  cd frontend && ./run.sh
  
  # When the frontend server is stopped, also stop the backend server
  kill $BACKEND_PID
}

# Parse command line arguments
case "$1" in
  backend)
    run_backend
    ;;
  frontend)
    run_frontend
    ;;
  both|"")
    run_both
    ;;
  *)
    usage
    ;;
esac
