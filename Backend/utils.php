<?php
function jsonResponse($data, $status = 200) {
  http_response_code($status);
  header("Content-Type: application/json");
  echo json_encode($data);
  exit;
}

function getJsonBody() {
  $raw = file_get_contents("php://input");
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function sanitize($str) {
  return trim(filter_var($str, FILTER_SANITIZE_SPECIAL_CHARS));
}

function validateEmail($email) {
  return filter_var($email, FILTER_VALIDATE_EMAIL);
}