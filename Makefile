.PHONY: help setup run backend frontend build clean install-backend install-frontend

# Colors for output
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[0;33m
NC := \033[0m # No Color

# Paths
BACKEND_DIR := .
FRONTEND_DIR := flight-search-engine

help: ## Show this help message
	@echo "$(BLUE)Flight Search Engine - Available Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

setup: install-backend install-frontend ## Complete setup (backend + frontend)
	@echo "$(GREEN)✅ Setup complete!$(NC)"
	@echo "$(YELLOW)Run 'make run' to start the application$(NC)"

install-backend: ## Install backend dependencies
	@echo "$(BLUE)📦 Installing backend dependencies...$(NC)"
	@cd $(BACKEND_DIR) && dotnet restore
	@echo "$(GREEN)✅ Backend dependencies installed$(NC)"

install-frontend: ## Install frontend dependencies
	@echo "$(BLUE)📦 Installing frontend dependencies...$(NC)"
	@if ! command -v pnpm &> /dev/null; then \
		echo "$(YELLOW)⚠️  pnpm not found, installing...$(NC)"; \
		npm install -g pnpm; \
	fi
	@cd $(FRONTEND_DIR) && pnpm install
	@echo "$(GREEN)✅ Frontend dependencies installed$(NC)"

run: ## Start both backend and frontend
	@echo "$(BLUE)🚀 Starting Flight Search Engine...$(NC)"
	@echo "$(YELLOW)Backend will start on http://localhost:5000$(NC)"
	@echo "$(YELLOW)Frontend will start on http://localhost:3000$(NC)"
	@echo ""
	@$(MAKE) -j2 backend frontend

backend: ## Start backend only
	@echo "$(BLUE)🔧 Starting backend...$(NC)"
	@cd $(BACKEND_DIR) && dotnet run

frontend: ## Start frontend only
	@echo "$(BLUE)🎨 Starting frontend...$(NC)"
	@cd $(FRONTEND_DIR) && pnpm dev

build: build-backend build-frontend ## Build both backend and frontend

build-backend: ## Build backend
	@echo "$(BLUE)🔨 Building backend...$(NC)"
	@cd $(BACKEND_DIR) && dotnet build
	@echo "$(GREEN)✅ Backend built successfully$(NC)"

build-frontend: ## Build frontend
	@echo "$(BLUE)🔨 Building frontend...$(NC)"
	@cd $(FRONTEND_DIR) && pnpm build
	@echo "$(GREEN)✅ Frontend built successfully$(NC)"

clean: ## Clean build artifacts
	@echo "$(BLUE)🧹 Cleaning build artifacts...$(NC)"
	@cd $(BACKEND_DIR) && dotnet clean
	@cd $(FRONTEND_DIR) && rm -rf .next out
	@echo "$(GREEN)✅ Clean complete$(NC)"

test-backend: ## Run backend tests
	@echo "$(BLUE)🧪 Running backend tests...$(NC)"
	@cd $(BACKEND_DIR) && dotnet test

dev: run ## Alias for 'run' command

start: run ## Alias for 'run' command

stop: ## Stop all running processes
	@echo "$(BLUE)🛑 Stopping all processes...$(NC)"
	@pkill -f "dotnet run" || true
	@pkill -f "next dev" || true
	@echo "$(GREEN)✅ All processes stopped$(NC)"

restart: stop run ## Restart the application

check: ## Check if all dependencies are installed
	@echo "$(BLUE)🔍 Checking dependencies...$(NC)"
	@command -v dotnet >/dev/null 2>&1 && echo "$(GREEN)✅ .NET SDK installed$(NC)" || echo "$(YELLOW)❌ .NET SDK not found$(NC)"
	@command -v node >/dev/null 2>&1 && echo "$(GREEN)✅ Node.js installed$(NC)" || echo "$(YELLOW)❌ Node.js not found$(NC)"
	@command -v pnpm >/dev/null 2>&1 && echo "$(GREEN)✅ pnpm installed$(NC)" || echo "$(YELLOW)❌ pnpm not found$(NC)"

info: ## Show project information
	@echo "$(BLUE)📋 Project Information$(NC)"
	@echo ""
	@echo "$(GREEN)Backend:$(NC)"
	@echo "  Framework: .NET 10.0"
	@echo "  Port: 5000"
	@echo "  Swagger: http://localhost:5000/swagger"
	@echo ""
	@echo "$(GREEN)Frontend:$(NC)"
	@echo "  Framework: Next.js 15"
	@echo "  Port: 3000"
	@echo "  URL: http://localhost:3000"
	@echo ""
	@echo "$(GREEN)API:$(NC)"
	@echo "  Provider: Amadeus"
	@echo "  Base URL: https://test.api.amadeus.com"

logs-backend: ## Show backend logs
	@echo "$(BLUE)📜 Backend logs (press Ctrl+C to exit)$(NC)"
	@cd $(BACKEND_DIR) && dotnet run --verbosity detailed

logs-frontend: ## Show frontend logs
	@echo "$(BLUE)📜 Frontend logs (press Ctrl+C to exit)$(NC)"
	@cd $(FRONTEND_DIR) && pnpm dev

.DEFAULT_GOAL := help

