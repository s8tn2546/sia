#!/bin/bash
# Script to run Python services
export PYTHONPATH=$PYTHONPATH:.
echo "Starting Python services on port 8000..."
./venv/bin/uvicorn api.service_api:app --host 0.0.0.0 --port 8000 --reload
