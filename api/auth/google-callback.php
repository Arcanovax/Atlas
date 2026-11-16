<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$state = $_GET['state'] ?? '';
$code = $_GET['code'] ?? '';
$storedState = $_SESSION['oauth_state'] ?? '';
$nonce = $_SESSION['oauth_nonce'] ?? '';
$startedAt = (int) ($_SESSION['oauth_started_at'] ?? 0);

unset($_SESSION['oauth_state'], $_SESSION['oauth_nonce'], $_SESSION['oauth_started_at']);

if (
    !is_string($state) ||
    !is_string($code) ||
    !hash_equals((string) $storedState, $state) ||
    $state === '' ||
    $code === '' ||
    $startedAt < time() - 600
) {
    jsonResponse(400, ['error' => 'Invalid or expired OAuth state']);
}

if (isset($_GET['error'])) {
    redirectTo($config['app_origin'] . '/login');
}

$postFields = http_build_query([
    'code' => $code,
    'client_id' => $config['google_client_id'],
    'client_secret' => $config['google_client_secret'],
    'redirect_uri' => $config['google_redirect_uri'],
    'grant_type' => 'authorization_code',
]);

$ch = curl_init('https://oauth2.googleapis.com/token');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $postFields,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
]);
$tokenResponse = curl_exec($ch);
$tokenStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if (!is_string($tokenResponse) || $tokenStatus < 200 || $tokenStatus >= 300) {
    error_log('Google OAuth token exchange failed');
    jsonResponse(502, ['error' => 'Authentication provider unavailable']);
}

$tokens = json_decode($tokenResponse, true);
if (!is_array($tokens) || !isset($tokens['id_token']) || !is_string($tokens['id_token'])) {
    error_log('Google OAuth response did not contain an ID token');
    jsonResponse(502, ['error' => 'Authentication provider unavailable']);
}

try {
    $_SESSION['user'] = validateGoogleIdentity(
        $tokens['id_token'],
        (string) $nonce,
        $config['google_client_id'],
    );
    session_regenerate_id(true);
    redirectTo($config['app_origin'] . '/dashboard');
} catch (Throwable $error) {
    error_log('Google identity validation failed: ' . $error->getMessage());
    jsonResponse(502, ['error' => 'Authentication provider unavailable']);
}
