<?php
require_once "config.php";

try {
    $stmt = $pdo->query('SELECT id, name FROM packages');
    echo "Existing packages:\n";
    while ($row = $stmt->fetch()) {
        echo 'ID: ' . $row['id'] . ', Name: ' . $row['name'] . "\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>