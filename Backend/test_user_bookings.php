<?php
require_once "config.php";

// Test the user_bookings.php endpoint
$email = 'tthapa.rashel@gmail.com'; // Using a known email from the database

$data = json_encode([
    'action' => 'list',
    'email' => $email
]);

$context = stream_context_create([
    'http' => [
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => $data
    ]
]);

$response = file_get_contents('http://localhost/NepalTrekTrails/Backend/user_bookings.php', false, $context);
echo "Response from user_bookings.php:\n";
echo $response;
?>