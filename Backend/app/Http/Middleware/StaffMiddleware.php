<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Check if user is admin
        if ($user->role === 'Admin') {
            return $next($request);
        }

        return response()->json(['message' => 'Access denied. Administrator privileges required.'], 403);
    }
}