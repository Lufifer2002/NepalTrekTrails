<?php
require_once "config.php";

try {
    // Check which columns already exist
    $columns = [];
    $stmt = $pdo->query("SHOW COLUMNS FROM bookings");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $columns[] = $row['Field'];
    }
    
    $updates = [];
    
    // Check and add transaction_id if it doesn't exist
    if (!in_array('transaction_id', $columns)) {
        $updates[] = "ADD COLUMN transaction_id VARCHAR(255) NULL AFTER status";
    }
    
    // Check and add paid_amount if it doesn't exist
    if (!in_array('paid_amount', $columns)) {
        $updates[] = "ADD COLUMN paid_amount DECIMAL(10, 2) NULL AFTER transaction_id";
    }
    
    // Check and add total_amount if it doesn't exist
    if (!in_array('total_amount', $columns)) {
        $updates[] = "ADD COLUMN total_amount DECIMAL(10, 2) NULL AFTER paid_amount";
    }
    
    // Execute the ALTER TABLE statement if there are updates
    if (!empty($updates)) {
        $sql = "ALTER TABLE bookings " . implode(', ', $updates);
        $pdo->exec($sql);
        echo "Bookings table updated successfully!\n";
        echo "Added columns: " . implode(', ', array_map(function($u) { 
            return explode(' ', $u)[2]; // Extract column name
        }, $updates)) . "\n";
    } else {
        echo "All columns already exist. No updates needed.\n";
    }
} catch (PDOException $e) {
    echo "Error updating table: " . $e->getMessage() . "\n";
}
?>