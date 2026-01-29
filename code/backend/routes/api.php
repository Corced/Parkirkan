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
    // Specific Vehicle Actions (Must be before resource)
    Route::get('/vehicles/parked', [VehicleController::class, 'parked']);
    Route::get('/vehicles/search-parked', [VehicleController::class, 'searchParked']);
    Route::post('/vehicles/check-in', [VehicleController::class, 'checkIn']);
    Route::post('/vehicles/check-out', [VehicleController::class, 'checkOut']);

    // Simulation
    Route::post('/simulate/shift', [App\Http\Controllers\SimulationController::class, 'simulateShift']);

    // Shifts
    Route::post('/shifts/start', [App\Http\Controllers\ShiftController::class, 'start']);
    Route::post('/shifts/end', [App\Http\Controllers\ShiftController::class, 'end']);

    // Resources
    Route::apiResource('users', UserController::class);
    Route::apiResource('vehicles', VehicleController::class);
    Route::apiResource('transactions', TransactionController::class);
    Route::apiResource('rates', ParkingRateController::class);
    Route::apiResource('areas', ParkingAreaController::class);
});
