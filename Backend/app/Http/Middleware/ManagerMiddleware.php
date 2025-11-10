<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ManagerMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        // Check if user is authenticated and is a staff member
        if (!$user || !isset($user->staff_id)) {
            return response()->json([
                'message' => 'Unauthorized. Staff access required.'
            ], 403);
        }

        // Check if the staff member is a manager
        if ($user->role !== 'Manager') {
            return response()->json([
                'message' => 'Unauthorized. Manager access required.'
            ], 403);
        }

        return $next($request);
    }
}