<?php
session_start();

$transactionId = $_GET['orderId']; // Unique transaction ID
$bookingId = $_GET['bookingId'];   // Original booking ID from database
$amount = $_GET['amount'];

$product_code = "EPAYTEST";
$secret_key = "8gBm/:&EnhH.1/q";
$merchant_code = "EPAYTEST";
// eSewa test secret key

$signed_field_names = "total_amount,transaction_uuid,product_code";
$signature_payload = "total_amount=$amount,transaction_uuid=$transactionId,product_code=$product_code";

$signature = base64_encode(hash_hmac('sha256', $signature_payload, $secret_key, true));

$esewaUrl = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
?>
<html>
<body onload="document.forms['esewaForm'].submit()">

<form name="esewaForm" method="POST" action="<?= $esewaUrl; ?>">
    <input type="hidden" name="amount" value="<?= $amount; ?>">
    <input type="hidden" name="tax_amount" value="0">
    <input type="hidden" name="total_amount" value="<?= $amount; ?>">
    <input type="hidden" name="transaction_uuid" value="<?= $transactionId; ?>">
    <input type="hidden" name="product_code" value="<?= $product_code; ?>">
    <input type="hidden" name="merchant_code" value="<?= $merchant_code; ?>">
    <input type="hidden" name="product_service_charge" value="0">
    <input type="hidden" name="product_delivery_charge" value="0">

    <input type="hidden" name="success_url" value="http://localhost/NepalTrekTrails/Backend/success.php?transactionId=<?= $transactionId; ?>&bookingId=<?= $bookingId; ?>&amount=<?= $amount; ?>">
    <input type="hidden" name="failure_url" value="http://localhost/NepalTrekTrails/Backend/failure.php?bookingId=<?= $bookingId; ?>">

    <input type="hidden" name="signed_field_names" value="<?= $signed_field_names; ?>">
    <input type="hidden" name="signature" value="<?= $signature; ?>">
</form>

</body>
</html>