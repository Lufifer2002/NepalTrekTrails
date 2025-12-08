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

if ($action === "create") {
    $name = sanitize($data["name"] ?? "");
    $description = sanitize($data["description"] ?? "");
    $duration = (int)($data["duration"] ?? 0);
    $price = (float)($data["price"] ?? 0);
    $difficulty = sanitize($data["difficulty"] ?? "");
    $imageUrl = sanitize($data["image_url"] ?? "");
    $trekHighlights = sanitize($data["trek_highlights"] ?? "");
    $dailyItinerary = sanitize($data["daily_itinerary"] ?? "");
    $whatsIncluded = sanitize($data["whats_included"] ?? "");
    $galleryUrls = sanitize($data["gallery_urls"] ?? "");
    $mapImageUrl = sanitize($data["map_image_url"] ?? "");
    
    if (!$name || !$duration || !$price) {
        jsonResponse(["status" => "error", "message" => "Name, duration, and price are required"], 400);
    }
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO packages (name, description, duration, price, difficulty, image_url, 
                trek_highlights, daily_itinerary, whats_included, gallery_urls, map_image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$name, $description, $duration, $price, $difficulty, $imageUrl,
            $trekHighlights, $dailyItinerary, $whatsIncluded, $galleryUrls, $mapImageUrl]);
        
        jsonResponse([
            "status" => "success", 
            "message" => "Package created successfully",
            "package_id" => $pdo->lastInsertId()
        ]);
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to create package: " . $e->getMessage()], 500);
    }
}

if ($action === "update") {
    $id = (int)($data["id"] ?? 0);
    $name = sanitize($data["name"] ?? "");
    $description = sanitize($data["description"] ?? "");
    $duration = (int)($data["duration"] ?? 0);
    $price = (float)($data["price"] ?? 0);
    $difficulty = sanitize($data["difficulty"] ?? "");
    $imageUrl = sanitize($data["image_url"] ?? "");
    $trekHighlights = sanitize($data["trek_highlights"] ?? "");
    $dailyItinerary = sanitize($data["daily_itinerary"] ?? "");
    $whatsIncluded = sanitize($data["whats_included"] ?? "");
    $galleryUrls = sanitize($data["gallery_urls"] ?? "");
    $mapImageUrl = sanitize($data["map_image_url"] ?? "");
    
    if (!$id || !$name || !$duration || !$price) {
        jsonResponse(["status" => "error", "message" => "ID, name, duration, and price are required"], 400);
    }
    
    try {
        $stmt = $pdo->prepare("
            UPDATE packages 
            SET name = ?, description = ?, duration = ?, price = ?, difficulty = ?, image_url = ?,
                trek_highlights = ?, daily_itinerary = ?, whats_included = ?, gallery_urls = ?, map_image_url = ?
            WHERE id = ?
        ");
        $stmt->execute([$name, $description, $duration, $price, $difficulty, $imageUrl,
            $trekHighlights, $dailyItinerary, $whatsIncluded, $galleryUrls, $mapImageUrl, $id]);
        
        if ($stmt->rowCount() > 0) {
            jsonResponse(["status" => "success", "message" => "Package updated successfully"]);
        } else {
            jsonResponse(["status" => "error", "message" => "Package not found"], 404);
        }
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to update package: " . $e->getMessage()], 500);
    }
}

if ($action === "delete") {
    $id = (int)($data["id"] ?? 0);
    
    if (!$id) {
        jsonResponse(["status" => "error", "message" => "Package ID is required"], 400);
    }
    
    try {
        $stmt = $pdo->prepare("DELETE FROM packages WHERE id = ?");
        $stmt->execute([$id]);
        
        if ($stmt->rowCount() > 0) {
            jsonResponse(["status" => "success", "message" => "Package deleted successfully"]);
        } else {
            jsonResponse(["status" => "error", "message" => "Package not found"], 404);
        }
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to delete package: " . $e->getMessage()], 500);
    }
}

if ($action === "list") {
    try {
        $stmt = $pdo->query("SELECT * FROM packages ORDER BY created_at DESC");
        $packages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        jsonResponse(["status" => "success", "data" => $packages]);
    } catch (PDOException $e) {
        jsonResponse(["status" => "error", "message" => "Failed to fetch packages: " . $e->getMessage()], 500);
    }
}

jsonResponse(["status" => "error", "message" => "Invalid action"], 400);
?>