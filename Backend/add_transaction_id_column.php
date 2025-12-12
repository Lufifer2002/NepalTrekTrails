<?php
require_once 'config.php';

try {
    // Add transaction_id column to bookings table if it doesn't exist
    $alterQuery = "ALTER TABLE bookings ADD COLUMN transaction_id VARCHAR(255) AFTER status";
    
    try {
        $pdo->exec($alterQuery);
        echo "Successfully added transaction_id column to bookings table!\n";
    } catch (PDOException $e) {
        if (strpos($e->getMessage(), 'Duplicate column') !== false) {
            echo "Column transaction_id already exists, skipping...\n";
        } else {
            throw $e;
        }
    }
    
    // Show updated structure
    $stmt = $pdo->query('DESCRIBE bookings');
    echo "\nUpdated Bookings table structure:\n";
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