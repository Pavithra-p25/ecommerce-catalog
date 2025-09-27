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
1. Create MySQL database:
   ```sql
   CREATE DATABASE product_catalog;
   ```
2. Update database configuration in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/product_catalog?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```
3. Run the seed script: `backend/db/seed.sql` in your MySQL database

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
1. Ensure MySQL is running and database is created
2. Run backend: `cd backend && mvn spring-boot:run`
3. Run frontend: `cd frontend && npm run dev`
4. Open `http://localhost:3000` and login with: **admin** / **admin123**

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
