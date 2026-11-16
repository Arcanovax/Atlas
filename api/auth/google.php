<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

$_SESSION['oauth_state'] = bin2hex(random_bytes(32));
$_SESSION['oauth_nonce'] = bin2hex(random_bytes(32));
$_SESSION['oauth_started_at'] = time();

$query = http_build_query([
    'client_id' => $config['google_client_id'],
    'redirect_uri' => $config['google_redirect_uri'],
    'response_type' => 'code',
    'scope' => 'openid email profile',
    'state' => $_SESSION['oauth_state'],
    'nonce' => $_SESSION['oauth_nonce'],
    'prompt' => 'select_account',
]);

redirectTo('https://accounts.google.com/o/oauth2/v2/auth?' . $query);
