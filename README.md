# Product Catalog System

## Project Description
A comprehensive product catalog web application for inventory management with React frontend, Spring Boot backend, and MySQL database.

## Features
- Admin authentication with JWT tokens
- Complete Product CRUD operations (Create, Read, Update, Delete)
- Product search and category filtering
- Pagination for large product lists
- Responsive UI with form validation
- Real-time error handling and notifications

## Tech Stack
- **Frontend**: ReactJS (hooks, react-router-dom)
- **Backend**: Java Spring Boot, Spring Security (JWT)
- **Database**: MySQL
- **Authentication**: JWT tokens with BCrypt password hashing

## Project Structure
```
ecommerce-catalog/
├── backend/                 # Spring Boot application
│   ├── src/main/java/
│   ├── src/main/resources/
│   ├── src/test/java/
│   ├── pom.xml
│   └── db/
│       └── seed.sql
├── frontend/                # React application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
└── README.md               # This file
```

## Setup Instructions

### Prerequisites
- JDK 17 or higher
- Maven 3.6+  
- Node.js 18+ and npm
- MySQL 8.0+

### Database Setup
1. Create MySQL database and user:
   ```sql
   CREATE DATABASE ecommerce_catalog;
   CREATE USER 'catalog_user'@'localhost' IDENTIFIED BY 'catalog_password';
   GRANT ALL PRIVILEGES ON ecommerce_catalog.* TO 'catalog_user'@'localhost';
   FLUSH PRIVILEGES;
   USE ecommerce_catalog;
   ```
2. Run the database setup script:
   ```bash
   mysql -u catalog_user -p ecommerce_catalog < database/setup.sql
   ```
   Or manually execute the SQL commands from `database/setup.sql`

3. **Note**: The admin user is created automatically by the Spring Boot application on first startup with secure password hashing. No manual password hash insertion needed!

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies and run:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
3. Backend will run on `http://localhost:8080`
4. API endpoints will be available at `http://localhost:8080/api/`

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Frontend will run on `http://localhost:3000`

### Quick Start

#### 🚀 **Automated Setup (Recommended)**
```bash
# Clone the repository
git clone https://github.com/Pavithra-p25/ecommerce-catalog.git
cd ecommerce-catalog

# Run automated setup script
./setup.sh          # Linux/macOS
setup.bat           # Windows
```

#### 📋 **Manual Setup** 
For detailed step-by-step instructions, see **[SETUP_GUIDE.md](SETUP_GUIDE.md)**

#### ⚡ **Quick Manual Setup**
1. **Clone**: `git clone https://github.com/Pavithra-p25/ecommerce-catalog.git`
2. **Database**: Run `database/setup.sql` in MySQL 
3. **Backend**: `cd backend && mvn clean install && mvn spring-boot:run`
4. **Frontend**: `cd frontend && npm install && npm run dev`
5. **Access**: `http://localhost:3000` (Login: **admin** / **admin123**)

> ✅ **The admin user is automatically created with secure password hashing - no manual hash insertion needed!**

## Default Login Credentials
- **Username**: admin
- **Password**: admin123

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Products
- `GET /api/products` - Get all products (with pagination, search, filter)
- `POST /api/products` - Create new product
- `GET /api/products/{id}` - Get product by ID
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

## Troubleshooting

### Common Issues

#### 1. Internal Server Error / Authentication Issues
**Problem**: Getting internal server error when trying to login, especially after fresh clone.

**Solution**: This is usually due to password hashing issues. The application now automatically creates the admin user with proper password hashing.

- ✅ **Fixed**: Admin user is created automatically by `DataInitializer` component
- ✅ **No manual hash insertion needed**: Password is hashed securely by Spring Security
- ✅ **Consistent across systems**: Works the same on any machine after clone

#### 2. Database Connection Issues
```bash
# Check MySQL service is running
sudo systemctl status mysql        # Linux
brew services list mysql          # macOS
net start mysql                   # Windows

# Test database connection
mysql -u catalog_user -p -h localhost ecommerce_catalog
```

#### 3. Port Already in Use
```bash
# Kill processes on specific ports
sudo lsof -ti:8080 | xargs sudo kill -9  # Backend
sudo lsof -ti:3000 | xargs sudo kill -9  # Frontend
```

#### 4. Maven Build Issues
```bash
# Clear Maven cache and rebuild
mvn clean
rm -rf ~/.m2/repository
mvn clean install
```

#### 5. Node.js/NPM Issues
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Verify Setup
1. **Backend Health Check**: `curl http://localhost:8080/api/products`
2. **Frontend Access**: Open `http://localhost:3000`
3. **Login Test**: Use admin/admin123 credentials
4. **Database Check**: Look for "✅ Admin user created successfully" in backend logs

## Testing
- **Backend**: `mvn test` in backend directory  
- **Frontend**: `npm test` in frontend directory

## Contributing
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes with meaningful commits
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

## License
MIT License
