<?php
require_once "config.php";

try {
    // Insert sample admin user (email: admin@nepaltrektrails.com, password: SecurePass!2025)
    $stmt = $pdo->prepare("INSERT IGNORE INTO users (name, email, password_hash) VALUES (?, ?, ?)");
    $stmt->execute([
        'Admin User', 
        'admin@nepaltrektrails.com', 
        '$2y$10$vwtIgw4BdzCdAWp3qx.QS.1kzTW3bOx/S50/BdTRz/RtU5hkAhB3G' // Hashed password
    ]);
    
    // Insert sample packages if they don't exist
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM packages");
    $stmt->execute();
    $packagesExist = $stmt->fetchColumn();
    
    if ($packagesExist == 0) {
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
    
    echo json_encode(["status" => "success", "message" => "Sample data inserted successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to insert sample data: " . $e->getMessage()]);
}
?>