<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Passport Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your Passport settings for your application.
    | You are free to adjust these settings as needed.
    |
    */

    'tokens' => [
        'access_token' => [
            'lifetime' => env('PASSPORT_ACCESS_TOKEN_LIFETIME', 60 * 60), // 1 hour
        ],
        'refresh_token' => [
            'lifetime' => env('PASSPORT_REFRESH_TOKEN_LIFETIME', 60 * 60 * 24 * 14), // 14 days
        ],
    ],

    'clients' => [
        'password_client' => [
            'id' => env('PASSPORT_PASSWORD_CLIENT_ID'),
            'secret' => env('PASSPORT_PASSWORD_CLIENT_SECRET'),
        ],
    ],

    'personal_access_client' => [
        'id' => env('PASSPORT_PERSONAL_ACCESS_CLIENT_ID'),
        'secret' => env('PASSPORT_PERSONAL_ACCESS_CLIENT_SECRET'),
    ],

    'storage' => [
        'database' => [
            'connection' => env('DB_CONNECTION', 'mysql'),
        ],
    ],

    'hash_client_secrets' => false,

    'enable_password_grant' => true,

    'enable_client_credentials_grant' => false,

    'enable_implicit_grant' => false,

    'enable_auth_code_grant' => false,

    'enable_personal_access_client' => true,

    'enable_password_client' => true,

    'enable_refresh_token_grant' => true,

    'enable_revoke_tokens' => true,

    'enable_token_pruning' => true,

    'token_pruning_interval' => 60 * 60 * 24, // 24 hours

    'token_pruning_batch_size' => 1000,

    'token_pruning_older_than' => 60 * 60 * 24 * 30, // 30 days

]; 