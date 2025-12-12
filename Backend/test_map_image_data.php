<?php
require_once "config.php";

// Test retrieving package data with map image
try {
    $stmt = $pdo->prepare('SELECT id, name, map_image_url FROM packages WHERE map_image_url IS NOT NULL AND map_image_url != "" LIMIT 1');
    $stmt->execute();
    $package = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($package) {
        echo "Package with map image:\n";
        echo "ID: " . $package['id'] . "\n";
        echo "Name: " . $package['name'] . "\n";
        echo "Map Image URL: " . $package['map_image_url'] . "\n";
    } else {
        echo "No packages with map images found.\n";
        // Let's check any package to see the structure
        $stmt = $pdo->prepare('SELECT id, name, map_image_url FROM packages LIMIT 1');
        $stmt->execute();
        $package = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($package) {
            echo "Sample package:\n";
            echo "ID: " . $package['id'] . "\n";
            echo "Name: " . $package['name'] . "\n";
            echo "Map Image URL: " . ($package['map_image_url'] ?: 'NULL') . "\n";
        }
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>