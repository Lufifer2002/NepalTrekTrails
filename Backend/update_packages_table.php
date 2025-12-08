<?php
require_once 'config.php';

try {
    // Add new columns to packages table if they don't exist
    $alterQueries = [
        "ALTER TABLE packages ADD COLUMN trek_highlights TEXT AFTER image_url",
        "ALTER TABLE packages ADD COLUMN daily_itinerary TEXT AFTER trek_highlights",
        "ALTER TABLE packages ADD COLUMN whats_included TEXT AFTER daily_itinerary",
        "ALTER TABLE packages ADD COLUMN gallery_urls TEXT AFTER whats_included"
    ];
    
    foreach ($alterQueries as $query) {
        try {
            $pdo->exec($query);
            echo "Executed: " . substr($query, 0, 50) . "...\n";
        } catch (PDOException $e) {
            // Column might already exist, check error
            if (strpos($e->getMessage(), 'Duplicate column') !== false) {
                echo "Column already exists, skipping...\n";
            } else {
                throw $e;
            }
        }
    }
    
    echo "\nDatabase updated successfully!\n";
    
    // Show updated structure
    $stmt = $pdo->query('DESCRIBE packages');
    echo "\nUpdated Packages table structure:\n";
    echo str_repeat("-", 50) . "\n";
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $row['Field'] . " - " . $row['Type'] . "\n";
    }
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
