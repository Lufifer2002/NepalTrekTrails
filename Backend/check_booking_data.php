<?php
require_once "config.php";

try {
    // Check if the new columns exist
    $stmt = $pdo->query("SHOW COLUMNS FROM bookings LIKE '%amount%'");
    $amountColumns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Amount-related columns in bookings table:\n";
    foreach ($amountColumns as $column) {
        echo "- " . $column['Field'] . " (" . $column['Type'] . ")\n";
    }
    
    // Check if there's any data with payment information
    $stmt = $pdo->query("SELECT id, package_name, status, transaction_id, paid_amount, total_amount FROM bookings WHERE paid_amount IS NOT NULL OR total_amount IS NOT NULL LIMIT 5");
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "\nBookings with payment data:\n";
    if (count($bookings) > 0) {
        foreach ($bookings as $booking) {
            echo "ID: " . $booking['id'] . ", Package: " . $booking['package_name'] . ", Status: " . $booking['status'] . 
                 ", Paid: " . ($booking['paid_amount'] ?? 'NULL') . ", Total: " . ($booking['total_amount'] ?? 'NULL') . 
                 ", Transaction: " . ($booking['transaction_id'] ?? 'NULL') . "\n";
        }
    } else {
        echo "No bookings with payment data found.\n";
    }
    
    // Show all bookings with all columns
    $stmt = $pdo->query("SELECT id, package_name, status, transaction_id, paid_amount, total_amount FROM bookings LIMIT 3");
    $allBookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "\nSample of all bookings:\n";
    foreach ($allBookings as $booking) {
        echo "ID: " . $booking['id'] . ", Package: " . $booking['package_name'] . ", Status: " . $booking['status'] . 
             ", Paid: " . ($booking['paid_amount'] ?? 'NULL') . ", Total: " . ($booking['total_amount'] ?? 'NULL') . 
             ", Transaction: " . ($booking['transaction_id'] ?? 'NULL') . "\n";
    }
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>