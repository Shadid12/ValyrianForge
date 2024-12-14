# Makefile to run backend and frontend services

.PHONY: all start-backend start-frontend

# Default target to run everything
default: all

# Run both backend and frontend
all: start-backend start-frontend

# Start the backend services
start-backend:
	@echo "Starting sqld service..."
	sqld --http-listen-addr=127.0.0.1:8000 &
	@echo "Fetching dependencies for the backend..."
	mix deps.get
	@echo "Shutting down any process using port 4000..."
	fuser -k 4000/tcp || true
	@echo "Starting the Phoenix server..."
	mix phx.server &

# Start the frontend services
start-frontend:
	@echo "Navigating to the frontend directory..."
	cd /frontend/dragon-stone && npm run dev