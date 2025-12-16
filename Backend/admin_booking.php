<?php
require_once "config.php";
require_once "utils.php";

// Only allow access via POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["status" => "error", "message" => "Method not allowed"], 405);
}

$data = getJsonBody();
$action = $data["action"] ?? "";

// For demo purposes, we'll use a simple admin check
// In a real application, you would implement proper authentication
$adminKey = $data["admin_key"] ?? "";
if ($adminKey !== "admin_secret_key_123") {
    jsonResponse(["status" => "error", "message" => "Unauthorized access"], 401);
}

if ($action === "list") {
    try {
        // Updated query to include the new payment fields and use consistent column names
        $stmt = $pdo->query("SELECT id, user_id, package_id, package_name, customer_name, customer_name as name, email, email as customer_email, phone, people_count, travel_date, payment_option, special_requests, status, transaction_id, paid_amount, total_amount, created_at FROM bookings ORDER BY created_at DESC");
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        jsonResponse(["status" => "success", "data" => $bookings]);
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to fetch bookings: " . $e->getMessage()], 500);
    }
}

if ($action === "update") {
    $id = (int)($data["id"] ?? 0);
    $status = sanitize($data["status"] ?? "");
    
    if (!$id || !$status) {
        jsonResponse(["status" => "error", "message" => "Booking ID and status are required"], 400);
    }
    
    try {
        $stmt = $pdo->prepare("UPDATE bookings SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
        
        if ($stmt->rowCount() > 0) {
            jsonResponse(["status" => "success", "message" => "Booking updated successfully"]);
        } else {
            jsonResponse(["status" => "error", "message" => "Booking not found"], 404);
        }
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to update booking: " . $e->getMessage()], 500);
    }
}

if ($action === "delete") {
    $id = (int)($data["id"] ?? 0);
    
    if (!$id) {
        jsonResponse(["status" => "error", "message" => "Booking ID is required"], 400);
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM bookings WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() > 0) {
            jsonResponse(["status" => "success", "message" => "Booking deleted successfully"]);
        } else {
            jsonResponse(["status" => "error", "message" => "Booking not found"], 404);
        }
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to delete booking: " . $e->getMessage()], 500);
    }
}

jsonResponse(["status" => "error", "message" => "Invalid action"], 400);
?>