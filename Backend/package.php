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

// Only allow access via GET requests for public package listing
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(["status" => "error", "message" => "Method not allowed"], 405);
}

// Check if specific package ID is requested
$packageId = isset($_GET['id']) ? intval($_GET['id']) : null;

try {
    if ($packageId) {
        // Fetch specific package by ID
        $stmt = $pdo->prepare("SELECT * FROM packages WHERE id = ?");
        $stmt->execute([$packageId]);
        $package = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($package) {
            jsonResponse(["status" => "success", "package" => $package]);
        } else {
            jsonResponse(["status" => "error", "message" => "Package not found"], 404);
        }
    } else {
        // Fetch all packages
        $stmt = $pdo->query("SELECT * FROM packages ORDER BY created_at DESC");
        $packages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        jsonResponse(["status" => "success", "packages" => $packages]);
    }
} catch (PDOException $e) {
    jsonResponse(["status" => "error", "message" => "Failed to fetch packages"], 500);
}
?>