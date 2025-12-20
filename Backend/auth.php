<?php
// Start session at the very beginning
session_start();

require_once "config.php";
require_once "utils.php";

// Add CORS headers
// For credentialed requests, we need to specify the exact origin instead of *
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
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
    
    try {
        // Check if user exists
        $stmt = $pdo->prepare("SELECT id, name, email, password_hash FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password_hash'])) {
            // Set session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['name'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_type'] = 'user';
            $_SESSION['login_time'] = time();
            
            // Remove password_hash from the response
            unset($user['password_hash']);
            jsonResponse([
                "status" => "success", 
                "message" => "Login successful",
                "user" => $user,
                "session_id" => session_id()
            ]);
        } else {
            jsonResponse(["status" => "error", "message" => "Invalid credentials"], 401);
        }
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Database error occurred"], 500);
    }
} elseif ($action === "register") {
    $name = sanitize($data["name"] ?? "");
    $email = sanitize($data["email"] ?? "");
    $password = $data["password"] ?? "";
    
    // Validation
    if (empty($name) || empty($email) || empty($password)) {
        jsonResponse(["status" => "error", "message" => "All fields are required"], 400);
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(["status" => "error", "message" => "Invalid email format"], 400);
    }
    
    if (strlen($password) < 6) {
        jsonResponse(["status" => "error", "message" => "Password must be at least 6 characters"], 400);
    }
    
    try {
        // Check if email already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        
        if ($stmt->fetch()) {
            error_log("Duplicate email detected: " . $email);
            jsonResponse(["status" => "error", "message" => "Email already registered"], 409);
        }
        
        // Hash password
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert new user
        $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)");
        $stmt->execute([$name, $email, $passwordHash]);
        
        $userId = $pdo->lastInsertId();
        
        jsonResponse([
            "status" => "success", 
            "message" => "Registration successful",
            "user" => [
                "id" => $userId,
                "name" => $name,
                "email" => $email
            ]
        ]);
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage() . " Code: " . $e->getCode());
        if ($e->getCode() == 23000) { // Duplicate entry
            error_log("Database duplicate entry for email: " . $email);
            jsonResponse(["status" => "error", "message" => "Email already registered"], 409);
        } else {
            jsonResponse(["status" => "error", "message" => "Database error occurred"], 500);
        }
    }
} elseif ($action === "logout") {
    // Destroy session
    session_unset();
    session_destroy();
    jsonResponse(["status" => "success", "message" => "Logout successful"]);
} elseif ($action === "check_session") {
    // Check if user is logged in
    if (isset($_SESSION['user_id']) && $_SESSION['user_type'] === 'user') {
        jsonResponse([
            "status" => "success",
            "logged_in" => true,
            "user" => [
                "id" => $_SESSION['user_id'],
                "name" => $_SESSION['user_name'],
                "email" => $_SESSION['user_email']
            ]
        ]);
    } else {
        jsonResponse(["status" => "success", "logged_in" => false]);
    }
} else {
    jsonResponse(["status" => "error", "message" => "Invalid action"], 400);
}
?>