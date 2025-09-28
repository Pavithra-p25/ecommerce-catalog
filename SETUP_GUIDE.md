# Complete Setup Guide for Fresh Installation

## Step 1: Database Cleanup (If Previously Attempted)

If you previously tried to set up this project and have an existing database, it's best to start fresh:

### Option A: Delete Existing Database (Recommended)
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Drop the old database completely
DROP DATABASE IF EXISTS ecommerce_catalog;

-- Also remove the old user if it exists
DROP USER IF EXISTS 'catalog_user'@'localhost';

-- Exit MySQL
EXIT;
```

### Option B: Keep Database but Clear Admin Table
```sql
-- Connect to your existing database
mysql -u catalog_user -p ecommerce_catalog

-- Clear the admins table (remove old hardcoded hash)
DELETE FROM admins WHERE username = 'admin';

-- Exit MySQL
EXIT;
```

## Step 2: Fresh Database Setup

### 2.1 Create New Database and User
```sql
-- Connect as MySQL root
mysql -u root -p

-- Create fresh database and user
CREATE DATABASE ecommerce_catalog;
CREATE USER 'catalog_user'@'localhost' IDENTIFIED BY 'catalog_password';
GRANT ALL PRIVILEGES ON ecommerce_catalog.* TO 'catalog_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2.2 Load Database Schema and Sample Data
```bash
# Navigate to project directory
cd ecommerce-catalog

# Load the database setup script
mysql -u catalog_user -p ecommerce_catalog < database/setup.sql
# When prompted, enter password: catalog_password
```

## Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Clean any previous builds
mvn clean

# Install dependencies and build
mvn install

# Start the backend server
mvn spring-boot:run
```

**✅ Watch for this success message:**
```
✅ Admin user created successfully with username: admin, password: admin123
✅ Password hash generated: $2a$10$[secure-hash-for-your-system]
```

## Step 4: Frontend Setup

Open a **new terminal** (keep backend running):

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Step 5: Test the Application

1. **Open Browser**: Go to `http://localhost:3000`

2. **Login with Credentials**:
   - Username: `admin`
   - Password: `admin123`

3. **Verify Features**:
   - ✅ Login successful (no internal server error)
   - ✅ Product list loads with Indian Rupee (₹) formatting
   - ✅ Can add new products
   - ✅ Can edit existing products
   - ✅ Can delete products
   - ✅ Search and filtering works

## Troubleshooting

### If You Get "Internal Server Error" During Login:

1. **Check Backend Logs** for this message:
   ```
   ✅ Admin user created successfully with username: admin, password: admin123
   ```

2. **If you DON'T see this message**, the DataInitializer didn't run:
   ```bash
   # Stop backend (Ctrl+C)
   # Restart backend
   mvn spring-boot:run
   ```

3. **If you see "Admin user already exists"** but login still fails:
   ```sql
   # Clear the admin table and restart backend
   mysql -u catalog_user -p ecommerce_catalog
   DELETE FROM admins WHERE username = 'admin';
   EXIT;
   
   # Restart backend - it will create admin user again
   mvn spring-boot:run
   ```

### Common Port Issues:

```bash
# If port 8080 is busy (backend)
sudo lsof -ti:8080 | xargs sudo kill -9

# If port 3000 is busy (frontend)
sudo lsof -ti:3000 | xargs sudo kill -9
```

### Database Connection Issues:

```bash
# Test database connection
mysql -u catalog_user -p -h localhost ecommerce_catalog

# If connection fails, check if MySQL is running:
sudo systemctl start mysql    # Linux
brew services start mysql    # macOS
net start mysql              # Windows
```

## What's Different Now (Fixed Issues)

### Before (Problematic):
- ❌ Hardcoded password hash in SQL
- ❌ Hash didn't work on different systems
- ❌ Internal server error on login
- ❌ Manual password hash insertion required

### After (Fixed):
- ✅ Automatic admin user creation
- ✅ System-specific password hashing
- ✅ No manual hash insertion needed
- ✅ Works consistently across all systems
- ✅ Proper security practices

## Success Indicators

You'll know everything is working when:

1. **Backend Startup**: See "✅ Admin user created successfully"
2. **Frontend Access**: `http://localhost:3000` loads without errors
3. **Login Success**: admin/admin123 logs in without internal server error
4. **Product Display**: Products show with ₹ (Indian Rupee) formatting
5. **CRUD Operations**: All create, read, update, delete functions work

## Final Notes

- **No More Hash Issues**: The DataInitializer component automatically handles password hashing
- **Cross-Platform**: Works the same on Windows, macOS, and Linux
- **Secure**: Uses Spring Security's BCrypt implementation properly
- **Maintainable**: No hardcoded security values in the codebase
