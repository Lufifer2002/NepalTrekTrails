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

// Get user's blogs by email
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['email'])) {
    $email = sanitize($_GET['email']);
    
    try {
        $stmt = $pdo->prepare("
            SELECT * FROM blogs 
            WHERE author_email = ?
            ORDER BY created_at DESC
        ");
        $stmt->execute([$email]);
        $blogs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        jsonResponse(["status" => "success", "blogs" => $blogs, "count" => count($blogs)]);
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to fetch blogs"], 500);
    }
}

// Get all approved blogs (for public blog page)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['email'])) {
    try {
        $stmt = $pdo->prepare("
            SELECT * FROM blogs 
            WHERE status = 'approved'
            ORDER BY created_at DESC
        ");
        $stmt->execute();
        $blogs = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        jsonResponse(["status" => "success", "blogs" => $blogs, "count" => count($blogs)]);
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to fetch blogs"], 500);
    }
}

// Create a new blog
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getJsonBody();
    
    $user_id = (int)($data["user_id"] ?? 0);
    $author_name = sanitize($data["author_name"] ?? "");
    $author_email = sanitize($data["author_email"] ?? "");
    $title = sanitize($data["title"] ?? "");
    $content = sanitize($data["content"] ?? "");
    $category = sanitize($data["category"] ?? "");
    $image_url = sanitize($data["image_url"] ?? "");
    
    // Validation
    if (!$author_name || !$author_email || !$title || !$content) {
        jsonResponse(["status" => "error", "message" => "Author name, email, title, and content are required"], 400);
    }
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO blogs (user_id, author_name, author_email, title, content, category, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $user_id,
            $author_name,
            $author_email,
            $title,
            $content,
            $category,
            $image_url
        ]);
        
        $blog_id = $pdo->lastInsertId();
        
        jsonResponse([
            "status" => "success", 
            "message" => "Blog created successfully", 
            "blog_id" => $blog_id
        ]);
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to create blog"], 500);
    }
}

// Delete a blog
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = getJsonBody();
    $id = (int)($data["id"] ?? 0);
    
    if (!$id) {
        jsonResponse(["status" => "error", "message" => "Blog ID is required"], 400);
    }
    
    try {
        // First check if the blog belongs to the user (in a real app, you'd verify user session)
        $stmt = $pdo->prepare("DELETE FROM blogs WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() > 0) {
            jsonResponse(["status" => "success", "message" => "Blog deleted successfully"]);
        } else {
            jsonResponse(["status" => "error", "message" => "Blog not found or unauthorized"], 404);
        }
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to delete blog"], 500);
    }
}

// If no valid request method matched
jsonResponse(["status" => "error", "message" => "Invalid request method or parameters"], 400);
?>