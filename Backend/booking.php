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

// Only allow access via POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["status" => "error", "message" => "Method not allowed"], 405);
}

$data = getJsonBody();

// Validate required fields
$package_id = (int)($data["package_id"] ?? 0);
$package_name = sanitize($data["package_name"] ?? "");
$customer_name = sanitize($data["customer_name"] ?? "");
$email = sanitize($data["email"] ?? "");
$phone = sanitize($data["phone"] ?? "");
$people_count = (int)($data["people_count"] ?? 0);
$travel_date = sanitize($data["travel_date"] ?? "");
$payment_option = sanitize($data["payment_option"] ?? "");
$status = sanitize($data["status"] ?? "confirmed"); // Default to confirmed unless specified
$total_amount = isset($data["total_amount"]) ? floatval($data["total_amount"]) : null; // New field

// Basic validation
if (!$package_id || !$package_name || !$customer_name || !validateEmail($email) || 
    !$people_count || !$travel_date || !$payment_option) {
    jsonResponse(["status" => "error", "message" => "All fields are required"], 400);
}

try {
    // If total_amount is not provided, fetch the package price from the database
    if ($total_amount === null) {
        $pkgStmt = $pdo->prepare("SELECT price FROM packages WHERE id = ?");
        $pkgStmt->execute([$package_id]);
        $pkg = $pkgStmt->fetch(PDO::FETCH_ASSOC);
        if ($pkg) {
            $total_amount = floatval($pkg['price']);
        }
    }
    
    $stmt = $pdo->prepare("
        INSERT INTO bookings (
            package_id, package_name, customer_name, email, phone, 
            people_count, travel_date, payment_option, special_requests, status, total_amount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $special_requests = sanitize($data["special_requests"] ?? "");
    
    $stmt->execute([
        $package_id, $package_name, $customer_name, $email, $phone,
        $people_count, $travel_date, $payment_option, $special_requests, $status, $total_amount
    ]);
    
    jsonResponse([
        "status" => "success", 
        "message" => "Booking submitted successfully",
        "booking_id" => $pdo->lastInsertId()
    ]);
} catch (PDOException $e) {
    jsonResponse(["status" => "error", "message" => "Failed to submit booking"], 500);
}
?>