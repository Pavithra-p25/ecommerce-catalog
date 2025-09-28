-- Database Setup Script for Ecommerce Catalog
-- This script creates the necessary tables and sample data

-- Create database and user (run as MySQL root)
-- CREATE DATABASE ecommerce_catalog;
-- CREATE USER 'catalog_user'@'localhost' IDENTIFIED BY 'catalog_password';
-- GRANT ALL PRIVILEGES ON ecommerce_catalog.* TO 'catalog_user'@'localhost';
-- FLUSH PRIVILEGES;
-- USE ecommerce_catalog;

-- Admins table (for authentication)
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    image_url VARCHAR(500),
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample products (prices in Indian Rupees)
INSERT INTO products (name, description, price, category, image_url, stock_quantity) VALUES
('Gaming Laptop', 'High-performance gaming laptop with RTX graphics', 82999.00, 'Electronics', 'https://via.placeholder.com/300x200', 10),
('Smartphone', 'Latest Android smartphone with 5G connectivity', 57999.00, 'Electronics', 'https://via.placeholder.com/300x200', 25),
('Wireless Headphones', 'Premium noise-cancelling wireless headphones', 16999.00, 'Electronics', 'https://via.placeholder.com/300x200', 15),
('Cotton T-Shirt', 'Comfortable cotton t-shirt available in multiple colors', 2499.00, 'Clothing', 'https://via.placeholder.com/300x200', 50),
('Denim Jeans', 'Classic blue denim jeans with modern fit', 6699.00, 'Clothing', 'https://via.placeholder.com/300x200', 30);

-- Note: Admin user will be created automatically by the Spring Boot application
-- Default admin credentials: username = admin, password = admin123
