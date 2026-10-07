<?php
header("Content-Type: application/json");
require_once __DIR__ . "/../models/Expense.php";

$method = $_SERVER["REQUEST_METHOD"];
$expenseModel = new Expense();

if ($method !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$category = isset($data["category"]) ? trim($data["category"]) : "";
$description = isset($data["description"]) ? trim($data["description"]) : "";
$amount = isset($data["amount"]) ? floatval($data["amount"]) : 0;
$date = isset($data["date"]) ? trim($data["date"]) : "";

if (empty($category) || empty($description) || $amount <= 0 || empty($date)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid expense data. Fill in all fields correctly."]);
    exit;
}

$success = $expenseModel->create($category, $description, $amount, $date);

if ($success) {
    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Expense logged successfully in XAMPP."
    ]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to record expense on server."]);
}
exit;
?>
