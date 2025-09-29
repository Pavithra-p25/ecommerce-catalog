# Windows Setup Guide for Ecommerce Catalog

## 📋 Prerequisites for Windows

### Required Software Installation

1. **Java JDK 21+**
   - Download from: https://adoptium.net/
   - Or use: `winget install Eclipse.Temurin.21.JDK`
   - Verify: `java --version` in Command Prompt

2. **Maven 3.9+**
   - Download from: https://maven.apache.org/download.cgi
   - Extract to `C:\Program Files\Apache\maven`
   - Add to PATH: `C:\Program Files\Apache\maven\bin`
   - Verify: `mvn --version`

3. **Node.js 18+**
   - Download from: https://nodejs.org/
   - Or use: `winget install OpenJS.NodeJS`
   - Verify: `node --version` and `npm --version`

4. **MySQL 8.0+**
   - Download MySQL Installer: https://dev.mysql.com/downloads/installer/
   - Or use: `winget install Oracle.MySQL`
   - During installation, set a root password (remember this!)

5. **Git (if not installed)**
   - Download from: https://git-scm.com/download/win
   - Or use: `winget install Git.Git`

## 🚀 Step-by-Step Setup After Clone

### Step 1: Open Command Prompt or PowerShell
- Press `Win + R`, type `cmd`, press Enter
- Or use PowerShell: `Win + X`, select "Windows PowerShell"

### Step 2: Navigate to Project Directory
```cmd
cd path\to\ecommerce-catalog
# For example: cd C:\Users\YourName\Desktop\ecommerce-catalog
```

### Step 3: Database Setup

#### Option A: Use the Automated Script (Recommended)
```cmd
setup.bat
```
Follow the prompts and enter your MySQL root password when asked.

#### Option B: Manual Database Setup
1. **Open MySQL Command Line Client** (from Start Menu)
2. **Enter your MySQL root password**
3. **Run these commands:**
```sql
CREATE DATABASE ecommerce_catalog;
CREATE USER 'catalog_user'@'localhost' IDENTIFIED BY 'catalog_password';
GRANT ALL PRIVILEGES ON ecommerce_catalog.* TO 'catalog_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
4. **Load sample data:**
```cmd
mysql -u catalog_user -p ecommerce_catalog < database\setup.sql
# When prompted, enter: catalog_password
```

### Step 4: Backend Setup
Open a new Command Prompt window:
```cmd
cd backend
mvn clean install
mvn spring-boot:run
```

**✅ Wait for this message:**
```
✅ Admin user created successfully with username: admin, password: admin123
Started ProductCatalogApplication in X.XXX seconds
```

### Step 5: Frontend Setup
Open **another** Command Prompt window (keep backend running):
```cmd
cd frontend
npm install
npm run dev
```

**✅ You should see:**
```
VITE v4.5.14  ready in XXXms
➜  Local:   http://localhost:3000/
```

### Step 6: Test the Application
1. **Open browser:** Go to `http://localhost:3000`
2. **Login with:**
   - Username: `admin`
   - Password: `admin123`
3. **Verify features work:** Add/edit/delete products, search, etc.

## 🐛 Windows-Specific Troubleshooting

### MySQL Issues

#### "MySQL is not recognized"
```cmd
# Add MySQL to PATH
set PATH=%PATH%;C:\Program Files\MySQL\MySQL Server 8.0\bin

# Or find where MySQL is installed:
where mysql
```

#### "Access denied for user 'root'"
- Use MySQL Workbench with GUI
- Or reset password using MySQL installer
- Try common passwords: empty, 'root', 'mysql'

#### "Can't connect to MySQL server"
```cmd
# Start MySQL service
net start mysql80
# Or use Services app (services.msc)
```

### Java/Maven Issues

#### "Java is not recognized"
```cmd
# Check Java installation
java --version
# If not found, add to PATH or reinstall Java
```

#### "mvn is not recognized"
```cmd
# Download Maven binary zip from maven.apache.org
# Extract to C:\Program Files\Apache\maven
# Add C:\Program Files\Apache\maven\bin to PATH
```

### Node.js Issues

#### "npm install fails"
```cmd
# Clear npm cache
npm cache clean --force
# Try with admin privileges
# Or use yarn instead: npm install -g yarn && yarn install
```

### Port Issues

#### "Port 8080 already in use"
```cmd
# Find process using port
netstat -ano | findstr :8080
# Kill the process (replace PID with actual number)
taskkill /PID [PID_NUMBER] /F
```

#### "Port 3000 already in use"
```cmd
# Find and kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

## 🔧 Alternative Setup Methods

### Using Windows Subsystem for Linux (WSL)
If you have WSL2 installed:
```bash
# Inside WSL2 Ubuntu
sudo apt update
sudo apt install default-jdk maven nodejs npm mysql-server
# Then follow Linux setup instructions
```

### Using Docker (Advanced)
If you have Docker Desktop:
```cmd
# Pull and run MySQL in container
docker run --name mysql-ecommerce -e MYSQL_ROOT_PASSWORD=rootpass -e MYSQL_DATABASE=ecommerce_catalog -p 3306:3306 -d mysql:8.0

# Update application.properties to use Docker MySQL
# spring.datasource.password=rootpass
```

### Using XAMPP
If you prefer XAMPP:
1. Install XAMPP with MySQL
2. Start MySQL from XAMPP Control Panel
3. Use phpMyAdmin to create database
4. Default root password is usually empty

## 📂 Project Structure After Setup
```
ecommerce-catalog\
├── backend\               # Spring Boot (runs on port 8080)
├── frontend\              # React app (runs on port 3000)  
├── database\
│   └── setup.sql         # Database schema and sample data
├── setup.bat             # Windows setup script
├── SETUP_GUIDE.md        # Detailed instructions
└── README.md             # Project overview
```

## ✅ Success Checklist

- [ ] Java 21+ installed (`java --version`)
- [ ] Maven installed (`mvn --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] MySQL 8.0+ installed and running
- [ ] Database created with sample data
- [ ] Backend running on port 8080
- [ ] Frontend running on port 3000
- [ ] Can login with admin/admin123
- [ ] All CRUD operations work

## 🆘 Still Having Issues?

### Common Windows Solutions:
1. **Run Command Prompt as Administrator**
2. **Disable Windows Antivirus temporarily** (it sometimes blocks MySQL)
3. **Check Windows Firewall** (allow Java and Node.js)
4. **Use PowerShell instead of Command Prompt**
5. **Install Visual C++ Redistributables** (for npm modules)

### Get Help:
- Check `SETUP_GUIDE.md` for detailed troubleshooting
- MySQL GUI tools: MySQL Workbench, phpMyAdmin
- Use Windows Event Viewer for system errors
- Check process manager for conflicting services

## 🎯 Quick Commands Summary

```cmd
# Clone and setup
git clone https://github.com/Pavithra-p25/ecommerce-catalog.git
cd ecommerce-catalog
setup.bat

# Manual start (if needed)
# Terminal 1:
cd backend && mvn spring-boot:run

# Terminal 2:  
cd frontend && npm run dev

# Open browser: http://localhost:3000
# Login: admin / admin123
```

**Windows users should now be able to successfully set up and run the ecommerce catalog!** 🎉
