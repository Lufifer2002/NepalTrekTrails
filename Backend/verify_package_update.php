<?php
require_once "config.php";

try {
    $stmt = $pdo->prepare('SELECT trek_highlights, daily_itinerary, whats_included FROM packages WHERE id = ?');
    $stmt->execute([9]);
    $package = $stmt->fetch();
    
    if ($package) {
        echo "Package data:\n";
        echo "Trek Highlights:\n" . $package['trek_highlights'] . "\n\n";
        echo "Daily Itinerary:\n" . $package['daily_itinerary'] . "\n\n";
        echo "What's Included:\n" . $package['whats_included'] . "\n";
    } else {
        echo "Package not found.\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>