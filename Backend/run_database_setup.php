<?php
/**
 * Database Setup Script for Nepal Trek Trails
 * This script executes the database_setup.sql file to create all necessary tables
 */

require_once "config.php";

// Check if user is authorized to run this script
// In a production environment, you would implement proper authentication
$authorized = true; // For demo purposes, always authorized

if (!$authorized) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized access"]);
    exit;
}

try {
    // Read the SQL file
    $sqlFile = 'database_setup.sql';
    $sql = file_get_contents($sqlFile);
    
    if ($sql === false) {
        throw new Exception("Failed to read SQL file: $sqlFile");
    }
    
    // Split the SQL file into individual statements
    $statements = explode(';', $sql);
    
    // Execute each statement
    foreach ($statements as $statement) {
        $statement = trim($statement);
        if (!empty($statement)) {
            $pdo->exec($statement);
        }
    }
    
    echo json_encode([
        "status" => "success", 
        "message" => "Database setup completed successfully!"
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => "Database setup failed: " . $e->getMessage()
    ]);
}
?>