<?php
require_once "config.php";
require_once "utils.php";

// Only allow access via POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(["status" => "error", "message" => "Method not allowed"], 405);
}

$data = getJsonBody();

// Validate required fields
$name = sanitize($data["name"] ?? "");
$email = sanitize($data["email"] ?? "");
$subject = sanitize($data["subject"] ?? "");
$message = sanitize($data["message"] ?? "");

// Basic validation
if (!$name || !validateEmail($email) || !$subject || !$message) {
    jsonResponse(["status" => "error", "message" => "All fields are required"], 400);
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO contact_messages (name, email, subject, message) 
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([$name, $email, $subject, $message]);
    
    jsonResponse([
        "status" => "success", 
        "message" => "Message sent successfully"
    ]);
} catch (PDOException $e) {
    jsonResponse(["status" => "error", "message" => "Failed to send message"], 500);
}
?>