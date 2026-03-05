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

$email    = $data->email ?? "";
$password = $data->password ?? "";

/* validate */
if ($email == "" || $password == "") {
    echo json_encode([
        "status" => "error",
        "message" => "Missing credentials"
    ]);
    exit;
}

/* fetch username + hashed password */
$stmt = $conn->prepare(
    "SELECT username, password FROM users WHERE email=?"
);

$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();

/* user not found */
if (!$user) {
    echo json_encode([
        "status" => "error",
        "message" => "User not found"
    ]);
    exit;
}

/* verify hashed password */
if (password_verify($password, $user["password"])) {

    echo json_encode([
        "status" => "success",
        "username" => $user["username"]
    ]);

} else {

    echo json_encode([
        "status" => "error",
        "message" => "Wrong password"
    ]);
}
?>
