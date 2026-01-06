<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ResidentController;
use App\Http\Controllers\FloorController;
use App\Http\Controllers\AllergyController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DietController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\MedicationLibraryController;
use App\Http\Controllers\ResMedicationController;
use App\Http\Controllers\ResScheduleController;
use App\Http\Controllers\MedicationRoundController;
use App\Http\Controllers\ChangeRequestController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AuditLogController;

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

    // Get residents with medications for a specific dagdeel
    Route::get('/medication-dagdeel', [ResidentController::class, 'getWithMedicationForDagdeel']);

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

// Floor Management Routes
Route::prefix('floors')->group(function () {
    Route::get('/', [FloorController::class, 'index']);
    Route::get('/{id}', [FloorController::class, 'show']);
    Route::post('/', [FloorController::class, 'store']);
    Route::put('/{id}', [FloorController::class, 'update']);
    Route::delete('/{id}', [FloorController::class, 'destroy']);
});

// Allergy Management Routes
Route::prefix('allergies')->group(function () {
    // Kitchen staff allergy overview
    Route::get('/kitchen-overview', [AllergyController::class, 'kitchenOverview']);
    Route::get('/resident/{residentId}', [AllergyController::class, 'index']);
    Route::get('/{id}', [AllergyController::class, 'show']);
    Route::post('/', [AllergyController::class, 'store']);
    Route::put('/{id}', [AllergyController::class, 'update']);
    Route::delete('/{id}', [AllergyController::class, 'destroy']);
});

// Contact Management Routes
Route::prefix('contacts')->group(function () {
    Route::get('/resident/{residentId}', [ContactController::class, 'index']);
    Route::get('/{id}', [ContactController::class, 'show']);
    Route::post('/', [ContactController::class, 'store']);
    Route::put('/{id}', [ContactController::class, 'update']);
    Route::delete('/{id}', [ContactController::class, 'destroy']);
});

// Diet Management Routes
Route::prefix('diets')->group(function () {
    Route::get('/resident/{residentId}', [DietController::class, 'show']);
    Route::post('/', [DietController::class, 'store']);
    Route::put('/{id}', [DietController::class, 'update']);
    Route::delete('/{id}', [DietController::class, 'destroy']);
});

// Note Management Routes
Route::prefix('notes')->group(function () {
    Route::get('/', [NoteController::class, 'all']);
    Route::get('/resident/{residentId}', [NoteController::class, 'index']);
    Route::get('/{id}', [NoteController::class, 'show']);
    Route::post('/', [NoteController::class, 'store']);
    Route::put('/{id}', [NoteController::class, 'update']);
    Route::post('/{id}/resolve', [NoteController::class, 'resolve']);
    Route::post('/{id}/unresolve', [NoteController::class, 'unresolve']);
    Route::delete('/{id}', [NoteController::class, 'destroy']);
});

// Medication Library Routes
Route::prefix('medication-library')->group(function () {
    Route::get('/', [MedicationLibraryController::class, 'index']);
    Route::get('/{id}', [MedicationLibraryController::class, 'show']);
    Route::post('/', [MedicationLibraryController::class, 'store']);
    Route::put('/{id}', [MedicationLibraryController::class, 'update']);
    Route::delete('/{id}', [MedicationLibraryController::class, 'destroy']);
});

// Resident Medication Routes
Route::prefix('res-medications')->group(function () {
    Route::get('/resident/{residentId}', [ResMedicationController::class, 'index']);
    Route::get('/{id}', [ResMedicationController::class, 'show']);
    Route::post('/', [ResMedicationController::class, 'store']);
    Route::put('/{id}', [ResMedicationController::class, 'update']);
    Route::post('/{id}/deactivate', [ResMedicationController::class, 'deactivate']);
    Route::post('/{id}/activate', [ResMedicationController::class, 'activate']);
    Route::delete('/{id}', [ResMedicationController::class, 'destroy']);
});

// Medication Schedule Routes
Route::prefix('res-schedules')->group(function () {
    Route::get('/res-medication/{resMedicationId}', [ResScheduleController::class, 'index']);
    Route::get('/{id}', [ResScheduleController::class, 'show']);
    Route::post('/', [ResScheduleController::class, 'store']);
    Route::put('/{id}', [ResScheduleController::class, 'update']);
    Route::delete('/{id}', [ResScheduleController::class, 'destroy']);
});

// Medication Round Routes
Route::prefix('medication-rounds')->group(function () {
    Route::get('/', [MedicationRoundController::class, 'index']);
    Route::get('/{id}', [MedicationRoundController::class, 'show']);
    Route::post('/', [MedicationRoundController::class, 'store']);
    Route::post('/bulk', [MedicationRoundController::class, 'bulkStore']);
    Route::put('/{id}', [MedicationRoundController::class, 'update']);
    Route::delete('/{id}', [MedicationRoundController::class, 'destroy']);
});

// Change Request Routes
Route::prefix('change-requests')->group(function () {
    Route::get('/', [ChangeRequestController::class, 'index']);
    Route::get('/{id}', [ChangeRequestController::class, 'show']);
    Route::post('/', [ChangeRequestController::class, 'store']);
    Route::post('/{id}/approve', [ChangeRequestController::class, 'approve']);
    Route::post('/{id}/reject', [ChangeRequestController::class, 'reject']);
    Route::delete('/{id}', [ChangeRequestController::class, 'destroy']);
});

// Announcement Routes
Route::prefix('announcements')->group(function () {
    Route::get('/', [AnnouncementController::class, 'index']);
    Route::get('/user/{userId}', [AnnouncementController::class, 'getUserAnnouncements']);
    Route::get('/{id}', [AnnouncementController::class, 'show']);
    Route::post('/', [AnnouncementController::class, 'store']);
    Route::post('/{id}/mark-read', [AnnouncementController::class, 'markAsRead']);
    Route::delete('/{id}', [AnnouncementController::class, 'destroy']);
});

// Audit Log Routes
Route::prefix('audit-logs')->group(function () {
    Route::get('/', [AuditLogController::class, 'index']);
    Route::get('/{id}', [AuditLogController::class, 'show']);
    Route::get('/entity/{entityType}/{entityId}', [AuditLogController::class, 'getEntityLogs']);
    Route::post('/', [AuditLogController::class, 'store']);
});
