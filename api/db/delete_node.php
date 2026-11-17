<?php

declare(strict_types=1);

require_once __DIR__ . "/../auth/bootstrap.php";

if (!isset($_SESSION['user']['id']) || !is_string($_SESSION['user']['id'])) {
    jsonResponse(401, ['error' => 'Authentication required']);
}

require_once __DIR__ . "/../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];

$sql = "DELETE FROM nodes
        WHERE id = ?";

$stmt = $pdo->prepare($sql);

$stmt->execute([$id]);

$notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

jsonResponse(200, $notes);
