<?php
session_start();

$bookingId = $_GET['bookingId'] ?? '';
?>
<!DOCTYPE html>
<html>
<head>
    <title>Payment Failed - Nepal Trek Trails</title>
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
        .error-icon {
            font-size: 60px;
            color: #dc3545;
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
            background-color: #ffebee;
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
        <div class="error-icon">❌</div>
        <h1>Payment Failed or Cancelled</h1>
        <p>Your payment was not completed. Your booking is still pending and you can try payment again.</p>
        
        <?php if ($bookingId): ?>
        <div class="details">
            <div><span class="label">Booking ID:</span> <?= htmlspecialchars($bookingId) ?></div>
            <div><span class="label">Status:</span> Pending</div>
        </div>
        <?php endif; ?>
        
        <p>If you continue to experience issues, please contact our support team.</p>
        <a href="../frontend/my-bookings.html" class="btn">View Your Bookings</a>
        <a href="../frontend/packages.html" class="btn">Browse Packages</a>
    </div>
</body>
</html>