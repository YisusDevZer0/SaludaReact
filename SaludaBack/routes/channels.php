<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Canal para personal por licencia
Broadcast::channel('personal.licencia.{licencia}', function ($user, $licencia) {
    // Verificar que el usuario pertenece a esa licencia
    $userLicencia = $user->Id_Licencia ?? $user->ID_H_O_D ?? null;
    return $userLicencia == $licencia;
});
