<?php
require_once 'config.php';

try {
    // Add map_image_url column to packages table if it doesn't exist
    $alterQuery = "ALTER TABLE packages ADD COLUMN map_image_url VARCHAR(255) AFTER gallery_urls";
    
    try {
        $pdo->exec($alterQuery);
        echo "Successfully added map_image_url column to packages table!\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column') !== false) {
            echo "Column map_image_url already exists, skipping...\n";
        } else {
            throw $e;
        }
    }
    
    // Show updated structure
    $stmt = $pdo->query('DESCRIBE packages');
    echo "\nUpdated Packages table structure:\n";
    echo str_repeat("-", 50) . "\n";
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $row['Field'] . " - " . $row['Type'] . "\n";
    }
    
    echo str_repeat("-", 50) . "\n";
    echo "Database update completed successfully!\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
