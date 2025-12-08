<?php
// newsletter.php - Handle newsletter subscriptions

// Enable CORS for frontend requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate email
if (!isset($input['email']) || empty($input['email'])) {
    echo json_encode(['status' => 'error', 'message' => 'Email is required']);
    exit();
}

$email = trim($input['email']);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
    exit();
}

// Database connection
$host = 'localhost';
$dbname = 'nepal_trek';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit();
}

// Check if email already exists
$stmt = $pdo->prepare("SELECT id FROM newsletter_subscribers WHERE email = ?");
$stmt->execute([$email]);

if ($stmt->rowCount() > 0) {
    echo json_encode(['status' => 'success', 'message' => 'You are already subscribed to our newsletter!']);
    exit();
}

// Insert new subscriber
try {
    $stmt = $pdo->prepare("INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES (?, NOW())");
    $stmt->execute([$email]);
    
    echo json_encode(['status' => 'success', 'message' => 'Thank you for subscribing to our newsletter!']);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Failed to subscribe. Please try again.']);
}

?>