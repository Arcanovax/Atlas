<?php

declare(strict_types=1);

require_once __DIR__ . "/../auth/bootstrap.php";

if (!isset($_SESSION['user']['id']) || !is_string($_SESSION['user']['id'])) {
    jsonResponse(401, ['error' => 'Authentication required']);
}

require_once __DIR__ . "/../db.php";

$sql = "SELECT * FROM notes
        WHERE user_sub = ?
        ORDER BY created_at DESC";

$stmt = $pdo->prepare($sql);

$stmt->execute([$_SESSION['user']['id']]);

$notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

jsonResponse(200, $notes);
