#!/bin/bash

# Ecommerce Catalog Setup Script
# This script automates the setup process for fresh installation

echo "🚀 Ecommerce Catalog Setup Script"
echo "=================================="
echo

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if MySQL is running
check_mysql() {
    if ! command -v mysql &> /dev/null; then
        print_error "MySQL is not installed or not in PATH"
        exit 1
    fi
    
    if ! mysqladmin ping -h localhost --silent; then
        print_warning "MySQL service is not running. Please start MySQL first:"
        echo "  Linux:   sudo systemctl start mysql"
        echo "  macOS:   brew services start mysql"
        echo "  Windows: net start mysql"
        exit 1
    fi
    
    print_status "MySQL is running"
}

# Setup database
setup_database() {
    print_info "Setting up database..."
    echo
    print_warning "You will be asked for your MySQL ROOT PASSWORD"
    echo "This is the password you set when installing MySQL (might be empty - just press Enter)"
    echo "Common defaults: empty, 'root', 'mysql', or your system password"
    echo
    
    # Ask if they want to drop existing database
    echo "Checking if database already exists..."
    if mysql -u root -p -e "USE ecommerce_catalog;" 2>/dev/null; then
        echo
        print_warning "Database 'ecommerce_catalog' already exists!"
        read -p "Do you want to delete it and start fresh? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "Removing old database... (MySQL root password required again)"
            mysql -u root -p -e "DROP DATABASE IF EXISTS ecommerce_catalog; DROP USER IF EXISTS 'catalog_user'@'localhost';"
            print_status "Old database removed"
        fi
    fi
    
    # Create database and user
    echo "Creating database and user... (MySQL root password required)"
    mysql -u root -p << EOF
CREATE DATABASE IF NOT EXISTS ecommerce_catalog;
CREATE USER IF NOT EXISTS 'catalog_user'@'localhost' IDENTIFIED BY 'catalog_password';
GRANT ALL PRIVILEGES ON ecommerce_catalog.* TO 'catalog_user'@'localhost';
FLUSH PRIVILEGES;
EOF
    
    if [ $? -eq 0 ]; then
        print_status "Database and user created successfully"
    else
        print_error "Failed to create database. Please check your MySQL root password."
        exit 1
    fi
    
    # Load sample data
    if [ -f "database/setup.sql" ]; then
        mysql -u catalog_user -pcatalog_password ecommerce_catalog < database/setup.sql
        print_status "Sample data loaded successfully"
    else
        print_warning "Sample data file not found. You'll need to load it manually."
    fi
}

# Setup backend
setup_backend() {
    print_info "Setting up backend..."
    
    if [ ! -d "backend" ]; then
        print_error "Backend directory not found. Are you in the project root?"
        exit 1
    fi
    
    cd backend
    
    # Clean and install
    mvn clean install
    
    if [ $? -eq 0 ]; then
        print_status "Backend dependencies installed successfully"
    else
        print_error "Backend setup failed. Please check Maven installation."
        exit 1
    fi
    
    cd ..
}

# Setup frontend
setup_frontend() {
    print_info "Setting up frontend..."
    
    if [ ! -d "frontend" ]; then
        print_error "Frontend directory not found. Are you in the project root?"
        exit 1
    fi
    
    cd frontend
    
    # Install dependencies
    npm install
    
    if [ $? -eq 0 ]; then
        print_status "Frontend dependencies installed successfully"
    else
        print_error "Frontend setup failed. Please check Node.js/npm installation."
        exit 1
    fi
    
    cd ..
}

# Main setup process
main() {
    echo "This script will set up the Ecommerce Catalog application."
    echo "Make sure you have the following installed:"
    echo "  - Java 21+"
    echo "  - Maven 3.9+"
    echo "  - Node.js 18+"
    echo "  - MySQL 8.0+"
    echo
    
    read -p "Continue with setup? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
    
    # Run setup steps
    check_mysql
    setup_database
    setup_backend
    setup_frontend
    
    echo
    print_status "Setup completed successfully!"
    echo
    echo "🚀 To start the application:"
    echo
    echo "1. Start Backend (in one terminal):"
    echo "   cd backend && mvn spring-boot:run"
    echo
    echo "2. Start Frontend (in another terminal):"
    echo "   cd frontend && npm run dev"
    echo
    echo "3. Open browser and go to: http://localhost:3000"
    echo "   Login with: admin / admin123"
    echo
    print_info "Look for '✅ Admin user created successfully' in backend logs!"
    echo
    print_warning "If you get 'BUILD SUCCESS' but app doesn't start, check TROUBLESHOOTING.md"
}

# Run main function
main
