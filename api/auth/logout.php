<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', [
        'expires' => time() - 42000,
        'path' => $params['path'],
        'secure' => (bool) $params['secure'],
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}
session_destroy();

redirectTo($config['app_origin'] . '/login');
