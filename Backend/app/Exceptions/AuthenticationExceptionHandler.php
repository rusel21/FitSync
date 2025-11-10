<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthenticationExceptionHandler
{
    /**
     * Handle unauthenticated users for API requests.
     */
    public function handle(AuthenticationException $exception, Request $request): JsonResponse
    {
        return response()->json([
            'error' => 'Unauthenticated',
            'message' => 'You are not authenticated. Please log in.'
        ], 401);
    }
}