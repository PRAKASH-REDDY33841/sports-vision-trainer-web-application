<?php
require "db.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

$data = json_decode(file_get_contents("php://input"));

$email = $data->email ?? "";

if (!$email) {
    echo json_encode(["status"=>"error","msg"=>"Email required"]);
    exit;
}

$otp = rand(100000,999999);
$expiry = date("Y-m-d H:i:s", strtotime("+10 minutes"));

$stmt = $conn->prepare("UPDATE users SET reset_otp=?, otp_expiry=? WHERE email=?");
$stmt->bind_param("sss", $otp, $expiry, $email);
$stmt->execute();

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;

    $mail->Username = 'prakash33841@gmail.com';
    $mail->Password = 'tbhazosrngtcefyd';

    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;

    $mail->setFrom('prakash33841@gmail.com', 'Sports Vision Trainer');
    $mail->addAddress($email);

    $mail->Subject = 'Password Reset OTP';
    $mail->Body = "Your OTP is: $otp";

    $mail->send();

    echo json_encode(["status"=>"success"]);

} catch (Exception $e) {
    echo json_encode(["status"=>"error","msg"=>$mail->ErrorInfo]);
}
