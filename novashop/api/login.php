<?php
session_start();
header("Content-Type: application/json");
require_once __DIR__ . "/../models/User.php";

$method = $_SERVER["REQUEST_METHOD"];

if ($method !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$email = isset($data["email"]) ? trim($data["email"]) : "";
$password = isset($data["password"]) ? trim($data["password"]) : "";
$role = isset($data["role"]) ? trim($data["role"]) : "";

if (empty($email) || empty($password) || empty($role)) {
    http_response_code(400);
    echo json_encode(["error" => "Please fill in all fields."]);
    exit;
}

$userModel = new User();
$authenticatedUser = $userModel->login($email, $password, $role);

if ($authenticatedUser) {
    $_SESSION["user_id"] = $authenticatedUser["id"];
    $_SESSION["user_email"] = $authenticatedUser["email"];
    $_SESSION["user_role"] = $authenticatedUser["role"];

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "role" => $authenticatedUser["role"],
        "message" => "Authentication successful."
    ]);
} else {
    http_response_code(401);
    echo json_encode(["error" => "email incorrecto, contraseña, o rol."]);
}
exit;
?>
