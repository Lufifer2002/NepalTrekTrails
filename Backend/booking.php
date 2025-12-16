<?php
session_start();
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

// Validate travel date is not in the past
$today = new DateTime();
$travelDateTime = new DateTime($travel_date);
if ($travelDateTime < $today) {
    jsonResponse(["status" => "error", "message" => "Travel date cannot be in the past"], 400);
}

try {
    // Check if user already has an active booking (not cancelled or completed)
    $checkStmt = $pdo->prepare("
        SELECT COUNT(*) as active_bookings 
        FROM bookings 
        WHERE email = ? AND status NOT IN ('cancelled', 'completed')
    ");
    $checkStmt->execute([$email]);
    $result = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result['active_bookings'] > 0) {
        jsonResponse([
            "status" => "error", 
            "message" => "You already have an active booking. Please complete or cancel your existing booking before making a new one."
        ], 400);
    }

    // If total_amount is not provided, fetch the package price from the database
    if ($total_amount === null) {
        $pkgStmt = $pdo->prepare("SELECT price FROM packages WHERE id = ?");
        $pkgStmt->execute([$package_id]);
        $pkg = $pkgStmt->fetch(PDO::FETCH_ASSOC);
        if ($pkg) {
            $total_amount = floatval($pkg['price']);
        }
    }
    
    // Get user ID from session if available
    $userId = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    
    $stmt = $pdo->prepare("
        INSERT INTO bookings (
            user_id, package_id, package_name, customer_name, email, phone, 
            people_count, travel_date, payment_option, special_requests, status, total_amount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $special_requests = sanitize($data["special_requests"] ?? "");
    
    $stmt->execute([
        $userId, $package_id, $package_name, $customer_name, $email, $phone,
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