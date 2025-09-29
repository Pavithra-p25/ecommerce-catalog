#!/bin/bash

# Alternative setup script for systems where sudo mysql works
# This avoids the need to know the MySQL root password

echo "🚀 Alternative Ecommerce Catalog Setup (No Root Password Needed)"
echo "================================================================"
echo

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Setup database using sudo mysql (no password needed)
setup_database_sudo() {
    print_info "Setting up database using sudo mysql (no root password needed)..."
    
    # Check if database exists
    if sudo mysql -e "USE ecommerce_catalog;" 2>/dev/null; then
        print_warning "Database 'ecommerce_catalog' already exists!"
        read -p "Do you want to delete it and start fresh? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            sudo mysql -e "DROP DATABASE IF EXISTS ecommerce_catalog; DROP USER IF EXISTS 'catalog_user'@'localhost';"
            print_status "Old database removed"
        fi
    fi
    
    # Create database and user
    sudo mysql << EOF
CREATE DATABASE IF NOT EXISTS ecommerce_catalog;
CREATE USER IF NOT EXISTS 'catalog_user'@'localhost' IDENTIFIED BY 'catalog_password';
GRANT ALL PRIVILEGES ON ecommerce_catalog.* TO 'catalog_user'@'localhost';
FLUSH PRIVILEGES;
EOF
    
    if [ $? -eq 0 ]; then
        print_status "Database and user created successfully"
    else
        print_error "Failed to create database"
        exit 1
    fi
    
    # Load sample data
    if [ -f "database/setup.sql" ]; then
        mysql -u catalog_user -pcatalog_password ecommerce_catalog < database/setup.sql
        print_status "Sample data loaded successfully"
    else
        print_warning "Sample data file not found"
    fi
}

# Main setup
main() {
    echo "This script uses 'sudo mysql' to avoid needing the MySQL root password."
    echo "Make sure you have sudo privileges on this system."
    echo
    
    read -p "Continue with setup? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
    
    # Test sudo mysql access
    if ! sudo mysql -e "SELECT 'MySQL access test';" >/dev/null 2>&1; then
        print_error "Cannot access MySQL with sudo. Try the regular setup.sh script instead."
        exit 1
    fi
    
    setup_database_sudo
    
    # Backend setup
    print_info "Setting up backend..."
    cd backend && mvn clean install && cd ..
    if [ $? -eq 0 ]; then
        print_status "Backend setup completed"
    else
        print_error "Backend setup failed"
        exit 1
    fi
    
    # Frontend setup
    print_info "Setting up frontend..."
    cd frontend && npm install && cd ..
    if [ $? -eq 0 ]; then
        print_status "Frontend setup completed"
    else
        print_error "Frontend setup failed"
        exit 1
    fi
    
    echo
    print_status "Setup completed successfully!"
    echo
    echo "🚀 To start the application:"
    echo "1. Backend: cd backend && mvn spring-boot:run"
    echo "2. Frontend: cd frontend && npm run dev"
    echo "3. Open: http://localhost:3000 (Login: admin/admin123)"
}

main
