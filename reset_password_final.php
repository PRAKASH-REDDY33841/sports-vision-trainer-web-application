<?php
require "db.php";

$data = json_decode(file_get_contents("php://input"));

$email = $data->email ?? "";
$newPass = $data->password ?? "";

if (!$email || !$newPass) {
    echo json_encode(["status"=>"error","msg"=>"Missing data"]);
    exit;
}

$hashed = password_hash($newPass, PASSWORD_DEFAULT);

$stmt = $conn->prepare(
    "UPDATE users 
     SET password=?, reset_otp=NULL, otp_expiry=NULL 
     WHERE email=?"
);

$stmt->bind_param("ss", $hashed, $email);

if ($stmt->execute()) {
    echo json_encode(["status"=>"success"]);
} else {
    echo json_encode(["status"=>"error"]);
}
