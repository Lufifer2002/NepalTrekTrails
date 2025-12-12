<?php
require_once "config.php";

// Test retrieving package data
try {
    $stmt = $pdo->prepare('SELECT * FROM packages WHERE id = ?');
    $stmt->execute([9]);
    $package = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($package) {
        echo "Package data for editing:\n";
        echo json_encode($package, JSON_PRETTY_PRINT);
    } else {
        echo "Package not found.\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>