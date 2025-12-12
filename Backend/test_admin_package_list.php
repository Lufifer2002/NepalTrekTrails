<?php
// Simulate the admin_package.php list action
require_once "config.php";

$action = "list";

if ($action === "list") {
    try {
        $stmt = $pdo->query("SELECT * FROM packages ORDER BY created_at DESC");
        $packages = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        header("Content-Type: application/json");
        echo json_encode(["status" => "success", "data" => $packages]);
    } catch (PDOException $e) {
        header("Content-Type: application/json");
        echo json_encode(["status" => "error", "message" => "Failed to fetch packages: " . $e->getMessage()], 500);
    }
}
?>