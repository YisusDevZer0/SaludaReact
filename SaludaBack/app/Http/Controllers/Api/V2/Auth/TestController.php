<?php

namespace App\Http\Controllers\Api\V2\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function __invoke(Request $request)
    {
        return response()->json([
            'message' => 'Test controller funciona correctamente',
            'timestamp' => now()
        ]);
    }
} 