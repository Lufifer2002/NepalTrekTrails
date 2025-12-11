<?php
require_once "config.php";

$transactionId = $_GET['transactionId'] ?? '';
$bookingId = $_GET['bookingId'] ?? '';
$amount = $_GET['amount'] ?? '';

$url = "https://rc-epay.esewa.com.np/api/epay/transaction/";

$fields = [
    "product_code" => "EPAYTEST",
    "transaction_uuid" => $transactionId,
    "total_amount" => $amount
];

$curl = curl_init($url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($fields));
curl_setopt($curl, CURLOPT_HTTPHEADER, ["Content-Type: application/json"]);
$response = curl_exec($curl);
curl_close($curl);

$data = json_decode($response, true);
?>
<!DOCTYPE html>
<html>
<head>
    <title>Payment Success - Nepal Trek Trails</title>
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
        <?php if ($data && $data['status'] === "COMPLETE"): ?>
            <?php
            // Update booking status to confirmed
            try {
                $stmt = $pdo->prepare("UPDATE bookings SET status = 'confirmed' WHERE id = ?");
                $stmt->execute([$bookingId]);
            } catch (PDOException $e) {
                // Log error but still show success page
                error_log("Failed to update booking status: " . $e->getMessage());
            }
            ?>
            <div class="success-icon">✓</div>
            <h1>Payment Successful!</h1>
            <p>Your payment has been processed successfully.</p>
            
            <div class="details">
                <div><span class="label">Booking ID:</span> <?= htmlspecialchars($bookingId) ?></div>
                <div><span class="label">Transaction ID:</span> <?= htmlspecialchars($transactionId) ?></div>
                <div><span class="label">Amount:</span> Rs. <?= htmlspecialchars($amount) ?></div>
                <div><span class="label">Status:</span> Confirmed</div>
            </div>
            
            <p>Thank you for choosing Nepal Trek Trails!</p>
            <a href="../frontend/my-bookings.html" class="btn">View Your Bookings</a>
            <a href="../frontend/packages.html" class="btn">Browse More Packages</a>
        <?php else: ?>
            <div class="success-icon">⚠️</div>
            <h1>Payment Verification Failed</h1>
            <p>We couldn't verify your payment. Please contact support.</p>
            <div class="details">
                <div><span class="label">Booking ID:</span> <?= htmlspecialchars($bookingId) ?></div>
                <div><span class="label">Transaction ID:</span> <?= htmlspecialchars($transactionId) ?></div>
                <div><span class="label">Amount:</span> Rs. <?= htmlspecialchars($amount) ?></div>
                <div><span class="label">Status:</span> Verification Failed</div>
            </div>
            <p>Please contact our support team with your Transaction ID for assistance.</p>
            <a href="../frontend/contact.html" class="btn">Contact Support</a>
            <a href="../frontend/my-bookings.html" class="btn">View Your Bookings</a>
        <?php endif; ?>
    </div>
</body>
</html>