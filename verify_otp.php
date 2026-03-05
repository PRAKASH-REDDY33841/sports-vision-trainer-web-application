<?php
require "db.php";

$data = json_decode(file_get_contents("php://input"));

$email = $data->email ?? "";
$otp   = $data->otp ?? "";

if (!$email || !$otp) {
    echo json_encode([
        "status"=>"error",
        "msg"=>"Missing email or otp"
    ]);
    exit;
}

$stmt = $conn->prepare(
"SELECT reset_otp, otp_expiry FROM users WHERE email=?"
);
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();
$row = $result->fetch_assoc();

if (!$row) {
    echo json_encode([
        "status"=>"error",
        "msg"=>"User not found"
    ]);
    exit;
}

if ($row["reset_otp"] != $otp) {
    echo json_encode([
        "status"=>"error",
        "msg"=>"Invalid OTP"
    ]);
    exit;
}

if (strtotime($row["otp_expiry"]) < time()) {
    echo json_encode([
        "status"=>"error",
        "msg"=>"OTP expired"
    ]);
    exit;
}

echo json_encode([
    "status"=>"success"
]);
