<?php
require_once "config.php";
require_once "utils.php";

// Only allow access via POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["status" => "error", "message" => "Method not allowed"], 405);
}

$data = getJsonBody();
$bookingId = (int)($data["booking_id"] ?? 0);
$userEmail = sanitize($data["email"] ?? "");

if (!$bookingId || !$userEmail) {
    jsonResponse(["status" => "error", "message" => "Booking ID and email are required"], 400);
}

try {
    // First verify that the booking belongs to this user
    $stmt = $pdo->prepare("SELECT id FROM bookings WHERE id = ? AND email = ?");
    $stmt->execute([$bookingId, $userEmail]);
    $booking = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$booking) {
        jsonResponse(["status" => "error", "message" => "Booking not found or unauthorized"], 404);
    }
    
    // Update booking status to cancelled instead of deleting it
    $stmt = $pdo->prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?");
    $stmt->execute([$bookingId]);
    
    if ($stmt->rowCount() > 0) {
        jsonResponse(["status" => "success", "message" => "Booking cancelled successfully"]);
    } else {
        jsonResponse(["status" => "error", "message" => "Failed to cancel booking"], 500);
    }
} catch (PDOException $e) {
    jsonResponse(["status" => "error", "message" => "Failed to cancel booking: " . $e->getMessage()], 500);
}
?>