<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }

require_once "config.php";

try {
    // Create users table
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    
    // Create packages table
    $sql = "CREATE TABLE IF NOT EXISTS packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        duration INT,
        price DECIMAL(10, 2),
        difficulty VARCHAR(50),
        image_url VARCHAR(255),
        trek_highlights TEXT,
        daily_itinerary TEXT,
        whats_included TEXT,
        gallery_urls TEXT,
        map_image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    
    // Create bookings table
    $sql = "CREATE TABLE IF NOT EXISTS bookings (
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE SET NULL
    )";
    
    $pdo->exec($sql);
    
    // Create contact_messages table
    $sql = "CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(200),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    
    // Create newsletter_subscribers table
    $sql = "CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    
    // Create blogs table
    $sql = "CREATE TABLE IF NOT EXISTS blogs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        author_name VARCHAR(100) NOT NULL,
        author_email VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100),
        image_url VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )";
    
    $pdo->exec($sql);
    
    // Check if admin user exists, if not create one
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
    $stmt->execute(['admin@nepaltrektrails.com']);
    $adminExists = $stmt->fetchColumn();
    
    if (!$adminExists) {
        // Insert sample admin user (email: admin@nepaltrektrails.com, password: SecurePass!2025)
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
        $stmt->execute([
            'Admin User', 
            'admin@nepaltrektrails.com', 
            '$2y$10$vwtIgw4BdzCdAWp3qx.QS.1kzTW3bOx/S50/BdTRz/RtU5hkAhB3G' // Hashed password
        ]);
    }
    
    // Check if sample packages exist, if not create them
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM packages");
    $stmt->execute();
    $packagesExist = $stmt->fetchColumn();
    
    if (!$packagesExist) {
        // Insert sample packages
        $stmt = $pdo->prepare("INSERT INTO packages (name, description, duration, price, difficulty, image_url) VALUES (?, ?, ?, ?, ?, ?)");
        $packages = [
            ['Everest Base Camp Trek', 'Experience the world\'s highest peak with this iconic trek to Everest Base Camp. Journey through Sherpa villages and witness breathtaking mountain views.', 14, 1299.00, 'Challenging', 'https://api.luxuryholidaynepal.com/media/attachments/media-1f303bbb-1756878207.jpg'],
            ['Annapurna Circuit Trek', 'A diverse trek through varied landscapes, cultures, and stunning mountain views. One of the most popular treks in Nepal.', 18, 1499.00, 'Difficult', 'https://www.nepaltrekhub.com/wp-content/uploads/2020/12/tilicho-lake-trek.jpg'],
            ['Langtang Valley Trek', 'A beautiful valley trek with rich culture and breathtaking mountain scenery. Perfect for those seeking a shorter trek.', 10, 899.00, 'Moderate', 'https://completewellbeing.com/wp-content/uploads/2014/04/discover-the-beauty-of-trekking.jpg']
        ];
        
        foreach ($packages as $package) {
            $stmt->execute($package);
        }
    }
    
    echo json_encode(["status" => "success", "message" => "Database tables created/verified successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database setup failed: " . $e->getMessage()]);
}
?>