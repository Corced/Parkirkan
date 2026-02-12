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

    // Logs - Admin Only
    Route::get('/logs', [ActivityLogController::class, 'index'])->middleware('role:admin');

    // Dashboard Stats - Role Based
    Route::get('/dashboard/admin', [DashboardController::class, 'adminStats'])->middleware('role:admin');
    Route::get('/dashboard/petugas', [DashboardController::class, 'petugasStats'])->middleware('role:admin|petugas');
    Route::get('/dashboard/owner', [DashboardController::class, 'ownerStats'])->middleware('role:admin|owner');

    // Areas & Rates - Read: All (Authenticated), Write: Admin
    Route::get('/areas', [ParkingAreaController::class, 'index']);
    Route::get('/areas/{area}', [ParkingAreaController::class, 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::post('/areas', [ParkingAreaController::class, 'store']);
        Route::put('/areas/{area}', [ParkingAreaController::class, 'update']);
        Route::delete('/areas/{area}', [ParkingAreaController::class, 'destroy']);
    });

    Route::get('/rates', [ParkingRateController::class, 'index']);
    Route::get('/rates/{rate}', [ParkingRateController::class, 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::post('/rates', [ParkingRateController::class, 'store']);
        Route::put('/rates/{rate}', [ParkingRateController::class, 'update']);
        Route::delete('/rates/{rate}', [ParkingRateController::class, 'destroy']);
    });

    // Users - Admin Only
    Route::apiResource('users', UserController::class)->middleware('role:admin');

    // Vehicles & Transactions - Petugas & Admin
    Route::middleware('role:admin|petugas')->group(function () {
        Route::get('/vehicles/parked', [VehicleController::class, 'parked']);
        Route::get('/vehicles/search-parked', [VehicleController::class, 'searchParked']);
        Route::post('/vehicles/check-in', [VehicleController::class, 'checkIn']);
        Route::post('/vehicles/check-out', [VehicleController::class, 'checkOut']);
        Route::apiResource('vehicles', VehicleController::class)->only(['index', 'show', 'update']);
    });

    // Transactions - Admin & Owner (Read), Admin (Write if any)
    Route::middleware('role:admin|owner')->group(function () {
        Route::apiResource('transactions', TransactionController::class)->only(['index', 'show']);
    });

    // Shifts & Simulation - Petugas & Admin
    Route::middleware('role:admin|petugas')->group(function () {
        Route::post('/shifts/start', [App\Http\Controllers\ShiftController::class, 'start']);
        Route::post('/shifts/end', [App\Http\Controllers\ShiftController::class, 'end']);
        Route::post('/simulate/shift', [App\Http\Controllers\SimulationController::class, 'simulateShift']);
    });
});
