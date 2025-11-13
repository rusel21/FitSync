<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
        $origin = $request->headers->get('Origin');

        // Determine which origin to allow
        $allowOrigin = in_array($origin, $allowedOrigins) ? $origin : $allowedOrigins[0];

        $headers = [
            'Access-Control-Allow-Origin' => $allowOrigin,
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN, Accept, Origin',
            'Access-Control-Allow-Credentials' => 'true',
            'Access-Control-Max-Age' => '86400',
        ];

        // Handle preflight OPTIONS requests
        if ($request->isMethod('OPTIONS')) {
            return response()->json([], 200, $headers);
        }

        // Process the request and get the response
        $response = $next($request);

        // Add CORS headers to the response
        foreach ($headers as $key => $value) {
            $response->headers->set($key, $value);
        }

        return $response;
    }
}