<?php
require_once "config.php";
require_once "utils.php";

// Add CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow access via GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(["status" => "error", "message" => "Method not allowed"], 405);
}

// Get email from query parameter
$email = isset($_GET['email']) ? sanitize($_GET['email']) : null;

if (!$email) {
    jsonResponse(["status" => "error", "message" => "Email is required"], 400);
}

try {
    // Fetch bookings for the user
    $stmt = $pdo->prepare("
        SELECT 
            b.id,
            b.package_id,
            b.package_name,
            b.customer_name,
            b.email,
            b.phone,
            b.people_count,
            b.travel_date,
            b.payment_option,
            b.special_requests,
            b.status,
            b.created_at,
            p.price as package_price
        FROM bookings b
        LEFT JOIN packages p ON b.package_id = p.id
        WHERE b.email = ? 
        ORDER BY b.created_at DESC
    ");
    $stmt->execute([$email]);
    $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    jsonResponse([
        "status" => "success", 
        "bookings" => $bookings,
        "count" => count($bookings)
    ]);
} catch (PDOException $e) {
    jsonResponse(["status" => "error", "message" => "Failed to fetch bookings"], 500);
}
?>