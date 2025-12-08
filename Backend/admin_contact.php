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
        $stmt = $pdo->query("SELECT * FROM contact_messages ORDER BY created_at DESC");
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        jsonResponse(["status" => "success", "data" => $messages]);
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to fetch messages: " . $e->getMessage()], 500);
    }
}

if ($action === "view") {
    $id = (int)($data["id"] ?? 0);
    
    if (!$id) {
        jsonResponse(["status" => "error", "message" => "Message ID is required"], 400);
    }
    
    try {
        $stmt = $pdo->prepare("SELECT * FROM contact_messages WHERE id = ?");
        $stmt->execute([$id]);
        $message = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($message) {
            jsonResponse(["status" => "success", "data" => $message]);
        } else {
            jsonResponse(["status" => "error", "message" => "Message not found"], 404);
        }
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to fetch message: " . $e->getMessage()], 500);
    }
}

if ($action === "delete") {
    $id = (int)($data["id"] ?? 0);
    
    if (!$id) {
        jsonResponse(["status" => "error", "message" => "Message ID is required"], 400);
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM contact_messages WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() > 0) {
            jsonResponse(["status" => "success", "message" => "Message deleted successfully"]);
        } else {
            jsonResponse(["status" => "error", "message" => "Message not found"], 404);
        }
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to delete message: " . $e->getMessage()], 500);
    }
}

jsonResponse(["status" => "error", "message" => "Invalid action"], 400);
?>