<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ParkingRateController;
use App\Http\Controllers\ParkingAreaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ActivityLogController;

// Public Routes
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Logs
    Route::get('/logs', [ActivityLogController::class, 'index']);

    // Dashboard Stats
    Route::get('/dashboard/admin', [DashboardController::class, 'adminStats']);
    Route::get('/dashboard/petugas', [DashboardController::class, 'petugasStats']);
    Route::get('/dashboard/owner', [DashboardController::class, 'ownerStats']);

    // Resources
    Route::apiResource('users', UserController::class);
    Route::apiResource('vehicles', VehicleController::class); // includes park/unpark logic potentially
    Route::apiResource('transactions', TransactionController::class);
    Route::apiResource('rates', ParkingRateController::class);
    Route::apiResource('areas', ParkingAreaController::class);

    // Specific Actions
    Route::post('/vehicles/check-in', [VehicleController::class, 'checkIn']);
    Route::post('/vehicles/check-out', [VehicleController::class, 'checkOut']);
    Route::get('/vehicles/parked', [VehicleController::class, 'parked']);
});
