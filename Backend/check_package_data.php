<?php
require_once "config.php";

try {
    $stmt = $pdo->prepare('SELECT id, name, trek_highlights, daily_itinerary, whats_included FROM packages WHERE id = ?');
    $stmt->execute([9]);
    $package = $stmt->fetch();
    
    if ($package) {
        echo "Package ID: " . $package['id'] . "\n";
        echo "Package Name: " . $package['name'] . "\n\n";
        
        echo "Trek Highlights (raw data):\n";
        echo var_export($package['trek_highlights'], true) . "\n\n";
        
        echo "Daily Itinerary (raw data):\n";
        echo var_export($package['daily_itinerary'], true) . "\n\n";
        
        echo "What's Included (raw data):\n";
        echo var_export($package['whats_included'], true) . "\n\n";
        
        // Show how data would be split
        if ($package['trek_highlights']) {
            echo "Trek Highlights (split by newline):\n";
            $highlights = explode("\n", $package['trek_highlights']);
            foreach ($highlights as $i => $highlight) {
                echo "  " . ($i + 1) . ". " . var_export($highlight, true) . "\n";
            }
            echo "\n";
        }
        
        if ($package['daily_itinerary']) {
            echo "Daily Itinerary (split by newline):\n";
            $itinerary = explode("\n", $package['daily_itinerary']);
            foreach ($itinerary as $i => $line) {
                echo "  " . ($i + 1) . ". " . var_export($line, true) . "\n";
            }
            echo "\n";
        }
        
        if ($package['whats_included']) {
            echo "What's Included (split by newline):\n";
            $included = explode("\n", $package['whats_included']);
            foreach ($included as $i => $item) {
                echo "  " . ($i + 1) . ". " . var_export($item, true) . "\n";
            }
            echo "\n";
        }
    } else {
        echo "Package not found.\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>