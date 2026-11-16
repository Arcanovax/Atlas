<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if (!isset($_SESSION['user']) || !is_array($_SESSION['user'])) {
    jsonResponse(401, ['authenticated' => false]);
}

jsonResponse(200, [
    'authenticated' => true,
    'user' => $_SESSION['user'],
]);
