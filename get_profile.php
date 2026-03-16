<?php
require "db.php";

$email = $_GET["email"];

$q = $conn->prepare(
"SELECT username,bio,profile_image FROM users WHERE email=?"
);

$q->bind_param("s",$email);
$q->execute();

$r = $q->get_result()->fetch_assoc();

if($r && $r["profile_image"] != "") {
    $r["profile_image"] =
      "http://10.19.67.111/sports_vision_trainer/" . $r["profile_image"];
}

echo json_encode($r);
