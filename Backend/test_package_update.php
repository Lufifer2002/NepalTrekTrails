<?php
require_once "config.php";

// Test updating a package
try {
    $stmt = $pdo->prepare("
        UPDATE packages 
        SET trek_highlights = ?, daily_itinerary = ?, whats_included = ?
        WHERE id = ?
    ");
    
    $trekHighlights = "Mountain views\nLocal guides\nCultural experiences";
    $dailyItinerary = "Day 1: Arrival in Kathmandu | Arrive at airport and transfer to hotel\nDay 2: Trek to Namche | Ascend to Namche Bazaar";
    $whatsIncluded = "Airport pick-up and drop-off\nAccommodation in Kathmandu\nAll meals during trek";
    
    $stmt->execute([$trekHighlights, $dailyItinerary, $whatsIncluded, 9]);
    
    if ($stmt->rowCount() > 0) {
        echo "Package updated successfully!\n";
    } else {
        echo "No package was updated.\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>