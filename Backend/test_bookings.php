<?php
require_once "config.php";

try {
    $stmt = $pdo->query('SELECT id, package_name, customer_name, email FROM bookings LIMIT 3');
    $bookings = $stmt->fetchAll();
    foreach ($bookings as $booking) {
        echo 'ID: ' . $booking['id'] . ', Package: ' . $booking['package_name'] . ', Customer: ' . $booking['customer_name'] . ', Email: ' . $booking['email'] . "\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>