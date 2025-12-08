<?php
require_once 'config.php';

try {
    $stmt = $pdo->query('DESCRIBE packages');
    echo "Packages table structure:\n";
    echo str_repeat("-", 50) . "\n";
    
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $row['Field'] . " - " . $row['Type'] . "\n";
    }
    
    echo str_repeat("-", 50) . "\n";
    echo "Database schema check completed successfully!\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
