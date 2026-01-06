<?php

namespace App\Http\Controllers;

use App\Models\Allergy;
use Illuminate\Http\Request;

class AllergyController extends Controller
{
    /**
     * Get allergy overview for kitchen staff
     * Filters: ?floor=1&allergyType=Gluten&search=naam
     * Prioritizes residents with allergies, shows residents without allergies only when searched
     */
    public function kitchenOverview(Request $request)
    {
        $search = $request->input('search', '');
        $floorId = $request->input('floor', null);
        $allergyType = $request->input('allergyType', null);

        // If there's a search query, include all residents (with and without allergies)
        if ($search) {
            $query = \App\Models\Resident::with(['room.floor', 'allergies'])
                ->where('name', 'like', '%' . $search . '%');
        } else {
            // Otherwise, only show residents with allergies
            $query = \App\Models\Resident::with(['room.floor', 'allergies'])
                ->whereHas('allergies');
        }

        // Filter by floor if specified
        if ($floorId) {
            $query->whereHas('room', function($q) use ($floorId) {
                $q->where('floor_id', $floorId);
            });
        }

        // Filter by allergy type if specified
        if ($allergyType) {
            $query->whereHas('allergies', function($q) use ($allergyType) {
                $q->where('symptom', 'like', '%' . $allergyType . '%');
            });
        }

        $residents = $query->get()->map(function($resident) {
            return [
                'resident_id' => $resident->resident_id,
                'name' => $resident->name,
                'room_number' => $resident->room ? $resident->room->room_number : null,
                'floor_id' => $resident->room && $resident->room->floor ? $resident->room->floor->floor_id : null,
                'allergies' => $resident->allergies->map(function($allergy) {
                    return [
                        'allergy_id' => $allergy->allergy_id,
                        'symptom' => $allergy->symptom,
                        'severity' => $allergy->severity,
                        'notes' => $allergy->notes,
                    ];
                }),
                'has_allergies' => $resident->allergies->count() > 0,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $residents
        ]);
    }

    /**
     * Get all allergies for a specific resident
     */
    public function index($residentId)
    {
        $allergies = Allergy::where('resident_id', $residentId)
            ->with('resident')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $allergies
        ]);
    }

    /**
     * Get a specific allergy by ID
     */
    public function show($id)
    {
        $allergy = Allergy::with('resident')->find($id);

        if (!$allergy) {
            return response()->json([
                'success' => false,
                'message' => 'Allergie niet gevonden'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $allergy
        ]);
    }

    /**
     * Create a new allergy for a resident
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,resident_id',
            'symptom' => 'required|string|max:255',
            'severity' => 'required|in:mild,moderate,severe',
        ]);

        $allergy = Allergy::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Allergie succesvol aangemaakt',
            'data' => $allergy->load('resident')
        ], 201);
    }

    /**
     * Update allergy information
     */
    public function update(Request $request, $id)
    {
        $allergy = Allergy::find($id);

        if (!$allergy) {
            return response()->json([
                'success' => false,
                'message' => 'Allergie niet gevonden'
            ], 404);
        }

        $validated = $request->validate([
            'symptom' => 'sometimes|string|max:255',
            'severity' => 'sometimes|in:mild,moderate,severe',
        ]);

        $allergy->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Allergie succesvol bijgewerkt',
            'data' => $allergy->load('resident')
        ]);
    }

    /**
     * Delete an allergy
     */
    public function destroy($id)
    {
        $allergy = Allergy::find($id);

        if (!$allergy) {
            return response()->json([
                'success' => false,
                'message' => 'Allergie niet gevonden'
            ], 404);
        }

        $allergySymptom = $allergy->symptom;
        $allergy->delete();

        return response()->json([
            'success' => true,
            'message' => "Allergie '{$allergySymptom}' succesvol verwijderd"
        ]);
    }
}
