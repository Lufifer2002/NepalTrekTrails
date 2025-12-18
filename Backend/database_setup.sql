-- Nepal Trek Trails Database Setup
-- This script creates all necessary tables for the application

-- Create the database
CREATE DATABASE IF NOT EXISTS nepal_trek;
USE nepal_trek;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration INT,
    price DECIMAL(10, 2),
    difficulty VARCHAR(50),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    package_id INT,
    package_name VARCHAR(100),
    customer_name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    people_count INT,
    travel_date DATE,
    payment_option VARCHAR(50),
    special_requests TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    paid_amount DECIMAL(10, 2) DEFAULT 0.00,
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE SET NULL
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample admin user (email: admin@nepaltrektrails.com, password: SecurePass!2025)
INSERT INTO users (name, email, password_hash) VALUES 
('Admin User', 'admin@nepaltrektrails.com', '$2y$10$vwtIgw4BdzCdAWp3qx.QS.1kzTW3bOx/S50/BdTRz/RtU5hkAhB3G');

-- Insert sample packages
INSERT INTO packages (name, description, duration, price, difficulty, image_url) VALUES
('Everest Base Camp Trek', 'Experience the world''s highest peak with this iconic trek to Everest Base Camp. Journey through Sherpa villages and witness breathtaking mountain views.', 14, 1299.00, 'Challenging', 'https://api.luxuryholidaynepal.com/media/attachments/media-1f303bbb-1756878207.jpg'),
('Annapurna Circuit Trek', 'A diverse trek through varied landscapes, cultures, and stunning mountain views. One of the most popular treks in Nepal.', 18, 1499.00, 'Difficult', 'https://www.nepaltrekhub.com/wp-content/uploads/2020/12/tilicho-lake-trek.jpg'),
('Langtang Valley Trek', 'A beautiful valley trek with rich culture and breathtaking mountain scenery. Perfect for those seeking a shorter trek.', 10, 899.00, 'Moderate', 'https://completewellbeing.com/wp-content/uploads/2014/04/discover-the-beauty-of-trekking.jpg');

-- Add payment fields to existing bookings table (for databases created before these fields were added)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS paid_amount DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS transaction_id VARCHAR(100);

-- Display success message
SELECT 'Database setup completed successfully!' AS Message;