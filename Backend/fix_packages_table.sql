USE nepal_trek;

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

-- Insert sample packages
INSERT INTO packages (name, description, duration, price, difficulty, image_url) VALUES
('Everest Base Camp Trek', 'Experience the world\'s highest peak with this iconic trek to Everest Base Camp. Journey through Sherpa villages and witness breathtaking mountain views.', 14, 1299.00, 'Challenging', 'https://api.luxuryholidaynepal.com/media/attachments/media-1f303bbb-1756878207.jpg'),
('Annapurna Circuit Trek', 'A diverse trek through varied landscapes, cultures, and stunning mountain views. One of the most popular treks in Nepal.', 18, 1499.00, 'Difficult', 'https://www.nepaltrekhub.com/wp-content/uploads/2020/12/tilicho-lake-trek.jpg'),
('Langtang Valley Trek', 'A beautiful valley trek with rich culture and breathtaking mountain scenery. Perfect for those seeking a shorter trek.', 10, 899.00, 'Moderate', 'https://completewellbeing.com/wp-content/uploads/2014/04/discover-the-beauty-of-trekking.jpg');