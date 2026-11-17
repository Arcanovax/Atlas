<?php

declare(strict_types=1);

require_once __DIR__ . "/../auth/bootstrap.php";

if (!isset($_SESSION['user']['id']) || !is_string($_SESSION['user']['id'])) {
    jsonResponse(401, ['error' => 'Authentication required']);
}

require_once __DIR__ . "/../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$title = $data["title"];

$sql = "INSERT INTO nodes (user_sub, type, title)
        VALUES (?, ?, ?)";

$stmt = $pdo->prepare($sql);

$stmt->execute([
    $_SESSION['user']['id'],
	"folder",
    $title
]);

jsonResponse(200, [
    "success" => true,
    "id" => $pdo->lastInsertId()
]);
