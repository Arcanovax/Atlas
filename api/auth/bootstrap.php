<?php

declare(strict_types=1);

$configPath = __DIR__ . '/../config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    exit(json_encode(['error' => 'Server authentication is not configured']));
}

$config = require $configPath;
$requiredKeys = [
    'google_client_id',
    'google_client_secret',
    'google_redirect_uri',
    'app_origin',
];

foreach ($requiredKeys as $key) {
    if (!isset($config[$key]) || $config[$key] === '') {
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        exit(json_encode(['error' => 'Server authentication is not configured']));
    }
}

session_set_cookie_params([
    'lifetime' => 604800,
    'path' => '/',
    'secure' => (
        (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
        ($_SERVER['SERVER_PORT'] ?? null) === '443'
    ),
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

function jsonResponse(int $status, array $body): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body);
    exit;
}

function redirectTo(string $location): never
{
    header('Cache-Control: no-store');
    header('Location: ' . $location, true, 302);
    exit;
}

function validateGoogleIdentity(string $idToken, string $expectedNonce, string $clientId): array
{
    $url = 'https://oauth2.googleapis.com/tokeninfo?id_token=' . rawurlencode($idToken);
    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 10,
            'ignore_errors' => true,
        ],
    ]);
    $response = @file_get_contents($url, false, $context);
    if ($response === false) {
        throw new RuntimeException('Google identity validation failed');
    }

    $claims = json_decode($response, true);
    if (
        !is_array($claims) ||
        ($claims['aud'] ?? null) !== $clientId ||
        !in_array($claims['iss'] ?? null, ['accounts.google.com', 'https://accounts.google.com'], true) ||
        ($claims['email_verified'] ?? null) !== 'true' ||
        ($claims['nonce'] ?? null) !== $expectedNonce ||
        !isset($claims['sub'], $claims['email'])
    ) {
        throw new RuntimeException('Invalid Google identity claims');
    }

    return [
        'id' => (string) $claims['sub'],
        'email' => (string) $claims['email'],
        'name' => (string) ($claims['name'] ?? $claims['email']),
        'picture' => isset($claims['picture']) ? (string) $claims['picture'] : null,
    ];
}
