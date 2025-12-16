<?php

namespace App\Http\Controllers;

use App\Models\Allergy;
use Illuminate\Http\Request;

class AllergyController extends Controller
{
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
