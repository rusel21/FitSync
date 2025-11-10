<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Check if user is admin
        if ($user->role !== 'Admin') {
            return response()->json(['message' => 'Access denied. Admin only.'], 403);
        }

        return $next($request);
    }
}