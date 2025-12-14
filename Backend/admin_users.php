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
$action = $data["action"] ?? "";

// For demo purposes, we'll use a simple admin check
// In a real application, you would implement proper authentication
$adminKey = $data["admin_key"] ?? "";
if ($adminKey !== "admin_secret_key_123") {
    jsonResponse(["status" => "error", "message" => "Unauthorized access"], 401);
}

if ($action === "list") {
    try {
        $stmt = $pdo->query("SELECT id, name, email, created_at FROM users ORDER BY created_at DESC");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        jsonResponse(["status" => "success", "data" => $users]);
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to fetch users: " . $e->getMessage()], 500);
    }
} elseif ($action === "delete") {
    $id = (int)($data["id"] ?? 0);
    
    if (!$id) {
        jsonResponse(["status" => "error", "message" => "User ID is required"], 400);
    }
    
    // Prevent deleting the admin user
    try {
        // First check if this is the admin user
        $stmt = $pdo->prepare("SELECT email FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && $user['email'] === 'admin@nepaltrektrails.com') {
            jsonResponse(["status" => "error", "message" => "Cannot delete admin user"], 400);
            return;
        }
        
        // Delete the user
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() > 0) {
            jsonResponse(["status" => "success", "message" => "User deleted successfully"]);
        } else {
            jsonResponse(["status" => "error", "message" => "User not found"], 404);
        }
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to delete user: " . $e->getMessage()], 500);
    }
} else {
    jsonResponse(["status" => "error", "message" => "Invalid action"], 400);
}
?>