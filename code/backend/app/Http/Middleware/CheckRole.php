<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $role
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        $allowedRoles = explode('|', str_replace(',', '|', $roles));
        
        if (!$request->user() || !in_array($request->user()->role, $allowedRoles)) {
            return response()->json([
                'message' => 'Unauthorized. Only ' . $roles . ' can access this resource.'
            ], 403);
        }

        return $next($request);
    }
}
