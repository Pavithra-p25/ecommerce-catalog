@echo off
echo ============================================
echo   Ecommerce Catalog Setup Script (Windows)  
echo ============================================
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo ERROR: backend directory not found. Are you in the project root?
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ERROR: frontend directory not found. Are you in the project root?
    pause
    exit /b 1
)

echo This script will help you set up the Ecommerce Catalog application.
echo.
echo Make sure you have installed:
echo   - Java JDK 21+
echo   - Maven 3.9+  
echo   - Node.js 18+
echo   - MySQL 8.0+
echo.
pause

echo.
echo ========================================
echo   Step 1: Database Setup
echo ========================================
echo.
echo Please run these commands in MySQL Command Line Client:
echo.
echo CREATE DATABASE ecommerce_catalog;
echo CREATE USER 'catalog_user'@'localhost' IDENTIFIED BY 'catalog_password';
echo GRANT ALL PRIVILEGES ON ecommerce_catalog.* TO 'catalog_user'@'localhost';
echo FLUSH PRIVILEGES;
echo EXIT;
echo.
echo Then load sample data:
echo mysql -u catalog_user -p ecommerce_catalog ^< database\setup.sql
echo.
pause

echo.
echo ========================================
echo   Step 2: Backend Setup  
echo ========================================
echo.
cd backend
echo Installing backend dependencies...
call mvn clean install
if errorlevel 1 (
    echo ERROR: Backend setup failed!
    pause
    exit /b 1
)
echo Backend setup completed!
cd ..

echo.
echo ========================================
echo   Step 3: Frontend Setup
echo ========================================  
echo.
cd frontend
echo Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Frontend setup failed!
    pause
    exit /b 1
)
echo Frontend setup completed!
cd ..

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Start Backend (in Command Prompt):
echo    cd backend ^&^& mvn spring-boot:run
echo.
echo 2. Start Frontend (in another Command Prompt):
echo    cd frontend ^&^& npm run dev  
echo.
echo 3. Open browser: http://localhost:3000
echo    Login: admin / admin123
echo.
echo Look for this message in backend logs:
echo "✅ Admin user created successfully with username: admin, password: admin123"
echo.
pause
