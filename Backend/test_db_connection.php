<?php
require_once "config.php";

try {
    // Test database connection
    echo "Database connection successful!\n";
    
    // Check if packages table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'packages'");
    $tableExists = $stmt->fetch();
    
    if ($tableExists) {
        echo "Packages table exists.\n";
        
        // Count packages
        $stmt = $pdo->query("SELECT COUNT(*) FROM packages");
        $packageCount = $stmt->fetchColumn();
        echo "Number of packages in database: " . $packageCount . "\n";
        
        if ($packageCount == 0) {
            echo "No packages found. Running insert_sample_data.php...\n";
            include "insert_sample_data.php";
        } else {
            echo "Packages already exist in database.\n";
            // Display packages
            $stmt = $pdo->query("SELECT * FROM packages");
            $packages = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo "Packages in database:\n";
            foreach ($packages as $package) {
                echo "- " . $package['name'] . " (ID: " . $package['id'] . ")\n";
            }
        }
    } else {
        echo "Packages table does not exist. Running database setup...\n";
        include "run_database_setup.php";
    }
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
}
?>