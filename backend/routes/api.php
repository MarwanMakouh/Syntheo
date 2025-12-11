<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;

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
