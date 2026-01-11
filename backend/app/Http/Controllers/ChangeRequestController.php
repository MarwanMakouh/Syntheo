<?php

namespace App\Http\Controllers;

use App\Models\ChangeRequest;
use App\Services\AuditLogger;
use Illuminate\Http\Request;

class ChangeRequestController extends Controller
{
    /**
     * Get all change requests
     * Supports filtering by status, resident, and urgency
     */
    public function index(Request $request)
    {
        $query = ChangeRequest::with(['resident', 'requester', 'reviewer', 'changeFields']);

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by resident
        if ($request->has('resident_id') && $request->resident_id) {
            $query->where('resident_id', $request->resident_id);
        }

        // Filter by urgency
        if ($request->has('urgency') && $request->urgency) {
            $query->where('urgency', $request->urgency);
        }

        $requests = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $requests
        ]);
    }

    /**
     * Get a specific change request by ID
     */
    public function show($id)
    {
        $changeRequest = ChangeRequest::with(['resident', 'requester', 'reviewer', 'changeFields'])->find($id);

        if (!$changeRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Wijzigingsverzoek niet gevonden'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $changeRequest
        ]);
    }

    /**
     * Create a new change request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,resident_id',
            'requester_id' => 'required|exists:users,user_id',
            'urgency' => 'required|in:low,medium,high',
            'fields' => 'required|array|min:1',
            'fields.*.field_name' => 'required|string',
            'fields.*.old' => 'nullable|string',
            'fields.*.new' => 'required|string',
        ]);

        $validated['status'] = 'pending';
        $validated['created_at'] = now();

        $changeRequest = ChangeRequest::create([
            'resident_id' => $validated['resident_id'],
            'requester_id' => $validated['requester_id'],
            'urgency' => $validated['urgency'],
            'status' => $validated['status'],
            'created_at' => $validated['created_at'],
        ]);

        // Create change fields
        foreach ($validated['fields'] as $field) {
            $changeRequest->changeFields()->create($field);
        }

        return response()->json([
            'success' => true,
            'message' => 'Wijzigingsverzoek succesvol aangemaakt',
            'data' => $changeRequest->load(['resident', 'requester', 'changeFields'])
        ], 201);
    }

    /**
     * Approve a change request
     */
    public function approve(Request $request, $id)
    {
        $changeRequest = ChangeRequest::with('changeFields')->find($id);

        if (!$changeRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Wijzigingsverzoek niet gevonden'
            ], 404);
        }

        $validated = $request->validate([
            'reviewer_id' => 'required|exists:users,user_id',
        ]);

        // Apply the changes to the database
        $this->applyChanges($changeRequest);

        $changeRequest->update([
            'status' => 'approved',
            'reviewer_id' => $validated['reviewer_id'],
            'reviewed_at' => now(),
        ]);

        // Create audit log for approved change request
        $resident = $changeRequest->resident;
        $changesDescription = $this->formatChangesDescription($changeRequest);

        try {
            AuditLogger::log(
                'goedgekeurd',
                $changeRequest,
                $validated['reviewer_id'],
                null,
                null,
                ['message' => $changesDescription . ': ' . ($resident ? $resident->name : 'Bewoner #' . $changeRequest->resident_id)]
            );
        } catch (\Exception $e) {
            \Log::error('Audit log failed: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Wijzigingsverzoek goedgekeurd en toegepast',
            'data' => $changeRequest->load(['resident', 'requester', 'reviewer', 'changeFields'])
        ]);
    }

    /**
     * Apply approved changes to the database
     */
    private function applyChanges(ChangeRequest $changeRequest)
    {
        $resident = $changeRequest->resident;

        foreach ($changeRequest->changeFields as $field) {
            $fieldName = $field->field_name;
            $newValue = $field->new;

            // Handle different field types
            switch ($fieldName) {
                case 'diet_type':
                    // Update or create diet record
                    $existingDiet = \DB::table('diets')
                        ->where('resident_id', $resident->resident_id)
                        ->first();

                    if ($existingDiet) {
                        \DB::table('diets')
                            ->where('resident_id', $resident->resident_id)
                            ->update(['diet_type' => $newValue, 'updated_at' => now()]);
                    } else {
                        \DB::table('diets')
                            ->insert([
                                'resident_id' => $resident->resident_id,
                                'diet_type' => $newValue,
                                'preferences' => json_encode([]),
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                    }
                    break;

                case 'medication_dosage':
                    // Update medication dosage in res_medications
                    // This is simplified - you might need to identify which medication specifically
                    \DB::table('res_medications')
                        ->where('resident_id', $resident->resident_id)
                        ->update(['dosage' => $newValue, 'updated_at' => now()]);
                    break;

                case 'medication_frequency':
                    // Update medication frequency
                    \DB::table('res_medications')
                        ->where('resident_id', $resident->resident_id)
                        ->update(['frequency' => $newValue, 'updated_at' => now()]);
                    break;

                case 'room_number':
                    // Update room assignment
                    $newRoom = \DB::table('rooms')
                        ->where('room_number', $newValue)
                        ->first();

                    if ($newRoom) {
                        // Unlink from old room
                        \DB::table('rooms')
                            ->where('resident_id', $resident->resident_id)
                            ->update(['resident_id' => null, 'updated_at' => now()]);

                        // Link to new room
                        \DB::table('rooms')
                            ->where('room_id', $newRoom->room_id)
                            ->update(['resident_id' => $resident->resident_id, 'updated_at' => now()]);
                    }
                    break;

                case 'contact_phone':
                    // Update contact phone in contacts table
                    \DB::table('contacts')
                        ->where('resident_id', $resident->resident_id)
                        ->where('relationship', 'Noodcontact') // or another identifier
                        ->update(['phone' => $newValue, 'updated_at' => now()]);
                    break;

                case 'allergy':
                case 'allergies':
                    // Add new allergy
                    \DB::table('allergies')->insert([
                        'resident_id' => $resident->resident_id,
                        'symptom' => $newValue,
                        'severity' => 'medium', // Default severity
                        'created_at' => now(),
                    ]);
                    break;

                case 'preferences.likes':
                    // Update diet preferences - likes
                    $diet = \DB::table('diets')
                        ->where('resident_id', $resident->resident_id)
                        ->first();

                    $likesArray = array_map('trim', explode(',', $newValue));

                    if ($diet) {
                        $preferences = json_decode($diet->preferences, true) ?? [];
                        $preferences['likes'] = $likesArray;

                        \DB::table('diets')
                            ->where('resident_id', $resident->resident_id)
                            ->update([
                                'preferences' => json_encode($preferences),
                                'updated_at' => now()
                            ]);
                    } else {
                        $preferences = ['likes' => $likesArray, 'dislikes' => []];
                        \DB::table('diets')
                            ->insert([
                                'resident_id' => $resident->resident_id,
                                'diet_type' => null,
                                'preferences' => json_encode($preferences),
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                    }
                    break;

                case 'preferences.dislikes':
                    // Update diet preferences - dislikes
                    $diet = \DB::table('diets')
                        ->where('resident_id', $resident->resident_id)
                        ->first();

                    $dislikesArray = array_map('trim', explode(',', $newValue));

                    if ($diet) {
                        $preferences = json_decode($diet->preferences, true) ?? [];
                        $preferences['dislikes'] = $dislikesArray;

                        \DB::table('diets')
                            ->where('resident_id', $resident->resident_id)
                            ->update([
                                'preferences' => json_encode($preferences),
                                'updated_at' => now()
                            ]);
                    } else {
                        $preferences = ['likes' => [], 'dislikes' => $dislikesArray];
                        \DB::table('diets')
                            ->insert([
                                'resident_id' => $resident->resident_id,
                                'diet_type' => null,
                                'preferences' => json_encode($preferences),
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                    }
                    break;

                // Add more cases as needed for other field types
            }
        }
    }

    /**
     * Reject a change request
     */
    public function reject(Request $request, $id)
    {
        $changeRequest = ChangeRequest::find($id);

        if (!$changeRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Wijzigingsverzoek niet gevonden'
            ], 404);
        }

        $validated = $request->validate([
            'reviewer_id' => 'required|exists:users,user_id',
        ]);

        $changeRequest->update([
            'status' => 'rejected',
            'reviewer_id' => $validated['reviewer_id'],
            'reviewed_at' => now(),
        ]);

        // Create audit log for rejected change request
        $resident = $changeRequest->resident;
        $changesDescription = $this->formatChangesDescription($changeRequest);

        AuditLogger::log(
            'afgekeurd',
            $changeRequest,
            $validated['reviewer_id'],
            null,
            null,
            ['message' => $changesDescription . ' afgewezen: ' . ($resident ? $resident->name : 'Bewoner #' . $changeRequest->resident_id)]
        );

        return response()->json([
            'success' => true,
            'message' => 'Wijzigingsverzoek afgewezen',
            'data' => $changeRequest->load(['resident', 'requester', 'reviewer', 'changeFields'])
        ]);
    }

    /**
     * Delete a change request
     */
    public function destroy($id)
    {
        $changeRequest = ChangeRequest::find($id);

        if (!$changeRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Wijzigingsverzoek niet gevonden'
            ], 404);
        }

        $changeRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Wijzigingsverzoek succesvol verwijderd'
        ]);
    }

    /**
     * Format changes description for audit log
     */
    private function formatChangesDescription(ChangeRequest $changeRequest)
    {
        $fields = $changeRequest->changeFields;

        if ($fields->isEmpty()) {
            return 'Wijzigingsverzoek';
        }

        $fieldNames = $fields->pluck('field_name')->unique();

        // Map field names to readable Dutch names
        $fieldMap = [
            'diet_type' => 'Dieet wijziging',
            'medication_dosage' => 'Medicatie wijziging',
            'medication_frequency' => 'Medicatie wijziging',
            'room_number' => 'Kamer wijziging',
            'contact_phone' => 'Contact wijziging',
            'allergy' => 'Allergie wijziging',
            'allergies' => 'Allergie wijziging',
            'preferences.likes' => 'Dieet wijziging',
            'preferences.dislikes' => 'Dieet wijziging',
        ];

        $descriptions = [];
        foreach ($fieldNames as $fieldName) {
            $descriptions[] = $fieldMap[$fieldName] ?? ucfirst($fieldName);
        }

        return implode(', ', array_unique($descriptions));
    }
}
