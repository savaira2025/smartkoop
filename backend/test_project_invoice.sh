#!/bin/bash

# Set the environment variables
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Activate the virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Run the test script
python test_project_invoice.py

# Deactivate the virtual environment if it was activated
if [ -n "$VIRTUAL_ENV" ]; then
    deactivate
fi
