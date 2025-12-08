<?php
// Start session at the very beginning
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
$action = $data["action"] ?? "";

if ($action === "login") {
    $email = sanitize($data["email"] ?? "");
    $password = $data["password"] ?? "";
    
    if (empty($email) || empty($password)) {
        jsonResponse(["status" => "error", "message" => "Email and password are required"], 400);
    }
    
    // Admin credentials (in production, use database with hashed passwords)
    $adminEmail = "admin@nepaltrektrails.com";
    $adminPassword = "admin123"; // In production, use password_hash()
    
    if ($email === $adminEmail && $password === $adminPassword) {
        // Set session variables
        $_SESSION['admin_id'] = 1;
        $_SESSION['admin_email'] = $email;
        $_SESSION['user_type'] = 'admin';
        $_SESSION['login_time'] = time();
        
        jsonResponse([
            "status" => "success",
            "message" => "Admin login successful",
            "admin" => [
                "email" => $email
            ],
            "session_id" => session_id()
        ]);
    } else {
        jsonResponse(["status" => "error", "message" => "Invalid admin credentials"], 401);
    }
} elseif ($action === "logout") {
    // Destroy session
    session_unset();
    session_destroy();
    jsonResponse(["status" => "success", "message" => "Admin logout successful"]);
} elseif ($action === "check_session") {
    // Check if admin is logged in
    if (isset($_SESSION['admin_id']) && $_SESSION['user_type'] === 'admin') {
        jsonResponse([
            "status" => "success",
            "logged_in" => true,
            "admin" => [
                "email" => $_SESSION['admin_email']
            ]
        ]);
    } else {
        jsonResponse(["status" => "success", "logged_in" => false]);
    }
} else {
    jsonResponse(["status" => "error", "message" => "Invalid action"], 400);
}
?>
