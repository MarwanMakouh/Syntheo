<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ResidentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application.
| These routes are loaded by the RouteServiceProvider and all of them
| will be assigned to the "api" middleware group.
|
*/

// Room Management Routes (Admin)
Route::prefix('rooms')->group(function () {
    // Get all rooms with floor and resident info
    Route::get('/', [RoomController::class, 'index']);

    // Get specific room
    Route::get('/{id}', [RoomController::class, 'show']);

    // Unlink resident from room (for admin)
    Route::post('/{id}/unlink-resident', [RoomController::class, 'unlinkResident']);

    // Link resident to room
    Route::post('/{id}/link-resident', [RoomController::class, 'linkResident']);

    // Update room information
    Route::put('/{id}', [RoomController::class, 'update']);
});

// User Management Routes (Admin)
Route::prefix('users')->group(function () {
    // Get all users
    Route::get('/', [UserController::class, 'index']);

    // Get specific user
    Route::get('/{id}', [UserController::class, 'show']);

    // Create new user
    Route::post('/', [UserController::class, 'store']);

    // Update user
    Route::put('/{id}', [UserController::class, 'update']);

    // Delete user
    Route::delete('/{id}', [UserController::class, 'destroy']);
});

// Resident Management Routes
Route::prefix('residents')->group(function () {
    // Get all residents (with optional filters: ?search=naam&room=101&allergy=pinda)
    Route::get('/', [ResidentController::class, 'index']);

    // Search residents by name
    Route::get('/search', [ResidentController::class, 'search']);

    // Filter residents by room number
    Route::get('/room/{roomNumber}', [ResidentController::class, 'filterByRoom']);

    // Filter residents by allergy
    Route::get('/allergy/{allergySymptom}', [ResidentController::class, 'filterByAllergy']);

    // Get specific resident with full details
    Route::get('/{id}', [ResidentController::class, 'show']);

    // Create new resident
    Route::post('/', [ResidentController::class, 'store']);

    // Update resident
    Route::put('/{id}', [ResidentController::class, 'update']);

    // Delete resident
    Route::delete('/{id}', [ResidentController::class, 'destroy']);
});
