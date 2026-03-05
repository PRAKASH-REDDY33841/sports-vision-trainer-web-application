<?php
header("Content-Type: application/json");
require "db.php";

/* read json body */
$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo json_encode([
        "status" => "error",
        "message" => "No JSON received"
    ]);
    exit;
}

/* get fields */
$username = trim($data->username ?? "");
$email    = trim($data->email ?? "");
$password = trim($data->password ?? "");

/* validate */
if ($username == "" || $email == "" || $password == "") {
    echo json_encode([
        "status" => "error",
        "message" => "Missing fields"
    ]);
    exit;
}

/* ✅ check if email already exists */
$check = $conn->prepare("SELECT id FROM users WHERE email=?");
$check->bind_param("s", $email);
$check->execute();
$exists = $check->get_result();

if ($exists->num_rows > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Email already registered"
    ]);
    exit;
}

/* ✅ hash password */
$hash = password_hash($password, PASSWORD_DEFAULT);

/* insert */
$stmt = $conn->prepare(
    "INSERT INTO users(username,email,password)
     VALUES (?,?,?)"
);

$stmt->bind_param("sss", $username, $email, $hash);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Registered successfully"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "DB insert failed"
    ]);
}
?>
