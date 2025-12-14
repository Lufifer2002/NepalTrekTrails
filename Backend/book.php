<?php
session_start();
require_once "config.php";

// -----------------------------
// 1. Validate form submission
// -----------------------------
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    die("Invalid access!");
}

// -----------------------------
// 2. Sanitize incoming data
// -----------------------------
$customerName   = isset($_POST['customerName']) ? trim($_POST['customerName']) : "";
$customerEmail  = isset($_POST['customerEmail']) ? trim($_POST['customerEmail']) : "";
$customerPhone  = isset($_POST['customerPhone']) ? trim($_POST['customerPhone']) : "";
$peopleCount    = isset($_POST['peopleCount']) ? intval($_POST['peopleCount']) : 1;
$travelDate     = isset($_POST['travelDate']) ? $_POST['travelDate'] : "";
$packageId      = isset($_POST['packageId']) ? $_POST['packageId'] : "";
$paymentOption  = isset($_POST['paymentOption']) ? $_POST['paymentOption'] : "";
$specialRequest = isset($_POST['specialRequests']) ? trim($_POST['specialRequests']) : "";

// Validate travel date is not in the past
$today = new DateTime();
$travelDateTime = new DateTime($travelDate);
if ($travelDateTime < $today) {
    die("Travel date cannot be in the past.");
}

// -----------------------------
// 3. Get package price (from modal)
// -----------------------------
$amount = isset($_POST['packageAmount']) 
    ? floatval($_POST['packageAmount']) 
    : 0;

// Fallback (should not remain 0)
if ($amount <= 0) {
    $amount = 2000; // Replace with database value if you want
}

// -----------------------------
// 4. Save booking to database with pending status
// -----------------------------
try {
    // Get package name from database
    $stmt = $pdo->prepare("SELECT name FROM packages WHERE id = ?");
    $stmt->execute([$packageId]);
    $package = $stmt->fetch(PDO::FETCH_ASSOC);
    $packageName = $package ? $package['name'] : "Unknown Package";
    
    // Insert booking with pending status
    $stmt = $pdo->prepare("
        INSERT INTO bookings (
            package_id, package_name, customer_name, email, phone, 
            people_count, travel_date, payment_option, special_requests, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $status = "pending"; // Initially set to pending
    
    $stmt->execute([
        $packageId, $packageName, $customerName, $customerEmail, $customerPhone,
        $peopleCount, $travelDate, $paymentOption, $specialRequest, $status
    ]);
    
    $bookingId = $pdo->lastInsertId();
    
} catch (PDOException $e) {
    die("Failed to save booking: " . $e->getMessage());
}

// -----------------------------
// 5. Generate order ID for eSewa
// -----------------------------
$orderId = uniqid('ORD_');

// -----------------------------
// 6. Store booking data in session for later use
// -----------------------------
$_SESSION['booking'] = [
    "bookingId"     => $bookingId, // Add actual booking ID from database
    "orderId"       => $orderId,
    "customerName"  => $customerName,
    "customerEmail" => $customerEmail,
    "customerPhone" => $customerPhone,
    "peopleCount"   => $peopleCount,
    "travelDate"    => $travelDate,
    "packageId"     => $packageId,
    "amount"        => $amount,
    "specialRequest"=> $specialRequest
];

// -----------------------------
// 7. Redirect to eSewa if selected
// -----------------------------
if ($paymentOption === "Esewa") {
    // Encode name for safe URL passing
    $encodedName = urlencode($customerName);
    
    header("Location: esewaPay.php?orderId=$orderId&bookingId=$bookingId&amount=$amount&customer=$encodedName");
    exit;
}

// -----------------------------
// Fallback if no payment selected
// -----------------------------
echo "Invalid payment method selected.";
exit;
?>