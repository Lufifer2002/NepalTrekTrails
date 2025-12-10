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
            id,
            package_id,
            package_name,
            customer_name,
            email,
            phone,
            people_count,
            travel_date,
            payment_option,
            special_requests,
            status,
            created_at
        FROM bookings 
        WHERE email = ? 
        ORDER BY created_at DESC
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