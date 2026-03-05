<?php
require "db.php";

$email = $_POST["email"] ?? "";
$name  = $_POST["name"] ?? "";
$bio   = $_POST["bio"] ?? "";

$imagePath = "";

if(isset($_FILES["photo"]) && $_FILES["photo"]["tmp_name"] != "") {

    $uploadDir = __DIR__ . "/uploads/";   // ✅ real server path

    if(!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $filename = time() . "_" . basename($_FILES["photo"]["name"]);

    $serverPath = $uploadDir . $filename;        // filesystem path
    $dbPath = "uploads/" . $filename;           // DB path

    if(move_uploaded_file($_FILES["photo"]["tmp_name"], $serverPath)) {
        $imagePath = $dbPath;
    }
}

$stmt = $conn->prepare(
 "UPDATE users SET username=?, bio=?, profile_image=? WHERE email=?"
);

$stmt->bind_param("ssss",$name,$bio,$imagePath,$email);
$stmt->execute();

echo json_encode([
    "status"=>"success",
    "image"=>$imagePath
]);
