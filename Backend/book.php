<?php
session_start();

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
// 4. Generate order ID
// -----------------------------
$orderId = uniqid('ORD_');

// -----------------------------
// 5. Store booking data in session for later use
// -----------------------------
$_SESSION['booking'] = [
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
// 6. Redirect to eSewa if selected
// -----------------------------
if ($paymentOption === "Esewa") {

    // Encode name for safe URL passing
    $encodedName = urlencode($customerName);

    header("Location: esewaPay.php?orderId=$orderId&amount=$amount&customer=$encodedName");
    exit;
}

// -----------------------------
// Fallback if no payment selected
// -----------------------------
echo "Invalid payment method selected.";
exit;
?>
