<?php

declare(strict_types=1);

require_once __DIR__ . "/../auth/bootstrap.php";

if (!isset($_SESSION['user']['id']) || !is_string($_SESSION['user']['id'])) {
    jsonResponse(401, ['error' => 'Authentication required']);
}

require_once __DIR__ . "/../db.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = $data["id"] ?? null;
$title = trim((string) ($data["title"] ?? ""));

if ($id === null || $title === "") {
    jsonResponse(400, ['error' => 'Invalid node data']);
}

$sql = "UPDATE nodes
        SET title = ?
        WHERE id = ? AND user_sub = ?";

$stmt = $pdo->prepare($sql);
$stmt->execute([$title, $id, $_SESSION['user']['id']]);

jsonResponse(200, [
    "success" => true,
]);
