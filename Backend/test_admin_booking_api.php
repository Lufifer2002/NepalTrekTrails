<?php
// Test the admin booking API to see what data is being returned
$data = json_encode([
    "action" => "list",
    "admin_key" => "admin_secret_key_123"
]);

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => $data
    ]
]);

$response = file_get_contents('http://localhost/NepalTrekTrails/Backend/admin_booking.php', false, $context);
echo "Response from admin_booking.php:\n";
echo $response;
?>