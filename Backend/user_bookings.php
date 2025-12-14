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

// Allow access via both GET and POST requests for flexibility
if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["status" => "error", "message" => "Method not allowed"], 405);
}

// Get email from query parameter or POST data
$email = null;
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $email = isset($_GET['email']) ? sanitize($_GET['email']) : null;
} else {
    $data = getJsonBody();
    $email = isset($data['email']) ? sanitize($data['email']) : null;
}

// If email not in GET/POST data, try to get it from query parameters for POST requests
if (!$email && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = isset($_GET['email']) ? sanitize($_GET['email']) : null;
}

if (!$email) {
    jsonResponse(["status" => "error", "message" => "Email is required"], 400);
}

try {
    // Fetch bookings for the user, excluding cancelled bookings
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
            b.transaction_id,
            b.paid_amount,
            b.total_amount,
            b.created_at,
            p.price as package_price
        FROM bookings b
        LEFT JOIN packages p ON b.package_id = p.id
        WHERE b.email = ? AND b.status != 'cancelled'
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