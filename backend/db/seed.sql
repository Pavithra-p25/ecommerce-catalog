

-- Table for admin users
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for products
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    supplier VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better query performance
    INDEX idx_category (category),
    INDEX idx_product_name (product_name),
    INDEX idx_price (price)
);

-- Seed admin user
-- Password: admin123 (BCrypt hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFyLN7QKTYdgO.2)
INSERT INTO admins (username, password_hash) VALUES 
('admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewFyLN7QKTYdgO.2');

-- Seed sample products
INSERT INTO products (product_name, category, description, price, stock_quantity, supplier) VALUES
('Cotton T-Shirt', 'Apparel', 'Comfortable 100% cotton t-shirt available in multiple colors', 29.99, 150, 'ACME Textiles'),
('Wireless Headphones', 'Electronics', 'High-quality wireless Bluetooth headphones with noise cancellation', 199.99, 75, 'TechSound Corp'),
('Coffee Mug', 'Home & Kitchen', 'Ceramic coffee mug with heat-resistant handle, 12oz capacity', 12.50, 200, 'Kitchen Essentials'),
('Laptop Stand', 'Electronics', 'Adjustable aluminum laptop stand for ergonomic workspace', 45.00, 50, 'Office Solutions'),
('Running Shoes', 'Footwear', 'Lightweight running shoes with cushioned sole and breathable mesh', 89.99, 80, 'SportGear Inc'),
('Desk Lamp', 'Home & Office', 'LED desk lamp with adjustable brightness and USB charging port', 35.75, 60, 'LightTech'),
('Water Bottle', 'Sports & Outdoors', 'Stainless steel insulated water bottle, keeps drinks cold for 24 hours', 24.99, 120, 'HydroLife'),
('Bluetooth Speaker', 'Electronics', 'Portable Bluetooth speaker with waterproof design and 10-hour battery', 79.99, 40, 'SoundWave'),
('Yoga Mat', 'Sports & Outdoors', 'Non-slip yoga mat with extra cushioning, 6mm thick', 39.99, 90, 'FitLife'),
('Phone Case', 'Accessories', 'Protective silicone phone case with shock absorption', 15.99, 300, 'MobileGuard');

-- Additional sample data for testing pagination
INSERT INTO products (product_name, category, description, price, stock_quantity, supplier) VALUES
('Wireless Mouse', 'Electronics', 'Ergonomic wireless mouse with precision tracking', 25.99, 100, 'TechGear'),
('Kitchen Knife Set', 'Home & Kitchen', 'Professional 5-piece kitchen knife set with wooden block', 129.99, 25, 'Chef Pro'),
('Backpack', 'Accessories', 'Durable canvas backpack with multiple compartments', 49.99, 70, 'TravelMate'),
('Sunglasses', 'Accessories', 'UV protection sunglasses with polarized lenses', 89.99, 85, 'EyeWear Plus'),
('Plant Pot', 'Home & Garden', 'Ceramic plant pot with drainage holes, perfect for indoor plants', 18.50, 150, 'GreenThumb');

-- Verify the data
SELECT 'Admins created:' as Info, COUNT(*) as Count FROM admins
UNION ALL
SELECT 'Products created:' as Info, COUNT(*) as Count FROM products;
