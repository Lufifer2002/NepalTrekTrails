<?php
require_once "Backend/config.php";

try {
    // Fetch a sample booking to check its status
    $stmt = $pdo->query("SELECT id, package_name, email, status FROM bookings LIMIT 1");
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($booking) {
        echo "Booking ID: " . $booking['id'] . "\n";
        echo "Package: " . $booking['package_name'] . "\n";
        echo "Email: " . $booking['email'] . "\n";
        echo "Status: " . $booking['status'] . "\n";
    } else {
        echo "No bookings found in database.\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>