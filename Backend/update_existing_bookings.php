<?php
require_once "config.php";

try {
    // First, update all bookings to set the total_amount from the packages table
    $stmt = $pdo->prepare("
        UPDATE bookings b 
        JOIN packages p ON b.package_id = p.id 
        SET b.total_amount = p.price 
        WHERE b.total_amount IS NULL AND b.package_id IS NOT NULL
    ");
    $stmt->execute();
    $updatedTotal = $stmt->rowCount();
    
    echo "Updated total_amount for $updatedTotal bookings\n";
    
    // For bookings that have been paid (have transaction_id), set paid_amount to 10% of total_amount
    // (based on the eSewa payment system which collects 10% deposit)
    $stmt = $pdo->prepare("
        UPDATE bookings 
        SET paid_amount = total_amount * 0.10 
        WHERE paid_amount IS NULL AND transaction_id IS NOT NULL AND total_amount IS NOT NULL
    ");
    $stmt->execute();
    $updatedPaid = $stmt->rowCount();
    
    echo "Updated paid_amount for $updatedPaid bookings\n";
    
    // For confirmed bookings without paid_amount, set it to the full total_amount
    $stmt = $pdo->prepare("
        UPDATE bookings 
        SET paid_amount = total_amount 
        WHERE paid_amount IS NULL AND status = 'confirmed' AND total_amount IS NOT NULL
    ");
    $stmt->execute();
    $updatedConfirmed = $stmt->rowCount();
    
    echo "Updated paid_amount for $updatedConfirmed confirmed bookings\n";
    
    echo "Successfully updated existing bookings with payment information!\n";
    
} catch (PDOException $e) {
    echo "Error updating bookings: " . $e->getMessage() . "\n";
}
?>