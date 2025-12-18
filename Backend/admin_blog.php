<?php
require_once "config.php";
require_once "utils.php";

// Add CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get all blogs for admin with user data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->prepare("
            SELECT b.*, u.name as user_name, u.email as user_email 
            FROM blogs b 
            LEFT JOIN users u ON b.user_id = u.id
            ORDER BY b.created_at DESC
        ");
        $stmt->execute();
        $blogs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        jsonResponse(["status" => "success", "blogs" => $blogs, "count" => count($blogs)]);
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to fetch blogs"], 500);
    }
}

// Update blog status (approve/reject)
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = getJsonBody();
    
    $id = (int)($data["id"] ?? 0);
    $status = sanitize($data["status"] ?? "");
    
    if (!$id || !$status) {
        jsonResponse(["status" => "error", "message" => "Blog ID and status are required"], 400);
    }
    
    try {
        $stmt = $pdo->prepare("UPDATE blogs SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
        
        jsonResponse(["status" => "success", "message" => "Blog status updated successfully"]);
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to update blog status"], 500);
    }
}

// Delete blog
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = getJsonBody();
    $id = (int)($data["id"] ?? 0);
    
    if (!$id) {
        jsonResponse(["status" => "error", "message" => "Blog ID is required"], 400);
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM blogs WHERE id = ?");
        $stmt->execute([$id]);
        
        jsonResponse(["status" => "success", "message" => "Blog deleted successfully"]);
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to delete blog"], 500);
    }
}
?>