<?php

return [
    'google_client_id' => getenv('GOOGLE_CLIENT_ID') ?: 'your-client-id.apps.googleusercontent.com',
    'google_client_secret' => getenv('GOOGLE_CLIENT_SECRET') ?: 'your-client-secret',
    'google_redirect_uri' => getenv('GOOGLE_REDIRECT_URI') ?: 'https://atlas.aroundfr.com/api/auth/google-callback.php',
    'app_origin' => getenv('APP_ORIGIN') ?: 'https://atlas.aroundfr.com',
];
