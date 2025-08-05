<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Passport\Passport;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // Configurar Passport con métodos disponibles
        Passport::enablePasswordGrant();
        
        // Solo habilitar los métodos que existen en la versión actual de Passport
        if (method_exists(Passport::class, 'enablePersonalAccessClient')) {
            Passport::enablePersonalAccessClient();
        }
        
        if (method_exists(Passport::class, 'enablePasswordClient')) {
            Passport::enablePasswordClient();
        }
        
        if (method_exists(Passport::class, 'enableRefreshTokenGrant')) {
            Passport::enableRefreshTokenGrant();
        }
        
        if (method_exists(Passport::class, 'enableRevokeTokens')) {
            Passport::enableRevokeTokens();
        }
        
        if (method_exists(Passport::class, 'enableTokenPruning')) {
            Passport::enableTokenPruning();
        }

        // Configurar el tiempo de vida de los tokens (solo si los métodos existen)
        if (method_exists(Passport::class, 'tokensExpireIn')) {
            Passport::tokensExpireIn(now()->addHours(1));
        }
        
        if (method_exists(Passport::class, 'refreshTokensExpireIn')) {
            Passport::refreshTokensExpireIn(now()->addDays(14));
        }
        
        if (method_exists(Passport::class, 'personalAccessTokensExpireIn')) {
            Passport::personalAccessTokensExpireIn(now()->addMonths(6));
        }

        // Configurar el guard por defecto (solo si los métodos existen)
        if (method_exists(Passport::class, 'useClientModel')) {
            Passport::useClientModel(\Laravel\Passport\Client::class);
        }
        
        if (method_exists(Passport::class, 'useTokenModel')) {
            Passport::useTokenModel(\Laravel\Passport\Token::class);
        }
        
        if (method_exists(Passport::class, 'useAuthCodeModel')) {
            Passport::useAuthCodeModel(\Laravel\Passport\AuthCode::class);
        }
        
        if (method_exists(Passport::class, 'usePersonalAccessClientModel')) {
            Passport::usePersonalAccessClientModel(\Laravel\Passport\PersonalAccessClient::class);
        }
    }
}
