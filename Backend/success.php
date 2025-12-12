<?php
require_once "config.php";

// Get Booking ID
$bookingId = $_GET['bookingId'] ?? '';

// Get Transaction ID (GET first, then fallback to POST)
$transactionId = $_GET['transactionId'] ?? '';
if (isset($_POST['transaction_code'])) {
    $transactionId = $_POST['transaction_code'];
}

// Get Amount (GET first, then POST, default to 0)
$amount = 0;
if (isset($_GET['amount'])) {
    $amount = floatval($_GET['amount']);
} elseif (isset($_POST['amount'])) {
    $amount = floatval($_POST['amount']);
}

// Update booking with transaction ID and set status to confirmed
if (!empty($bookingId) && !empty($transactionId)) {
    try {
        $stmt = $pdo->prepare("UPDATE bookings SET transaction_id = ?, status = 'confirmed' WHERE id = ?");
        $stmt->execute([$transactionId, $bookingId]);
    } catch (PDOException $e) {
        // Log error but continue to show success page
        error_log("Failed to update booking: " . $e->getMessage());
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Payment Successful - Nepal Trek Trails</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .success-icon {
            font-size: 60px;
            color: #28a745;
            margin-bottom: 20px;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: #0b7d3a;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px;
        }
        .btn:hover {
            background-color: #095e2d;
        }
        .details {
            text-align: left;
            background-color: #f1f8e9;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .details div {
            margin: 10px 0;
        }
        .label {
            font-weight: bold;
            display: inline-block;
            width: 150px;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="success-icon">✓</div>
    <h1>Payment Successful!</h1>
    <p>Your payment has been processed successfully.</p>

    <div class="details">
        <div><span class="label">Booking ID:</span> <?= htmlspecialchars($bookingId ?: '—') ?></div>
        <div><span class="label">Transaction ID:</span> <?= htmlspecialchars($transactionId ?: '—') ?></div>
        <div><span class="label">Amount:</span> Rs. <?= $amount > 0 ? number_format($amount, 2) : '—' ?></div>
        <div><span class="label">Status:</span> Success</div>
    </div>

    <a href="../frontend/contact.html" class="btn">Contact Support</a>
    <a href="../frontend/my-bookings.html" class="btn">View Your Bookings</a>
</div>

</body>
</html>