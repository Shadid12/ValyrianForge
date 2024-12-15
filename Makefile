# Makefile to run backend, frontend, and Electron app

.PHONY: all start-backend start-frontend start-electron stop

# Default target to run everything
default: all

# Run backend, frontend, and Electron app
all: start-backend start-frontend start-electron

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
	cd /frontend/dragon-stone && npm run dev &

# Start the Electron app
start-electron:
	@echo "Starting the Electron app..."
	cd /frontend/dragon-stone && cross-env NODE_ENV=development electron . &

# Stop all running services
stop:
	@echo "Stopping all services..."
	@pkill -f "sqld" || true
	@pkill -f "mix phx.server" || true
	@pkill -f "npm run dev" || true
	@pkill -f "electron" || true
