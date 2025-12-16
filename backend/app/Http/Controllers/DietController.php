<?php

namespace App\Http\Controllers;

use App\Models\Diet;
use Illuminate\Http\Request;

class DietController extends Controller
{
    /**
     * Get diet information for a specific resident
     */
    public function show($residentId)
    {
        $diet = Diet::where('resident_id', $residentId)
            ->with('resident')
            ->first();

        if (!$diet) {
            return response()->json([
                'success' => false,
                'message' => 'Dieet niet gevonden'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $diet
        ]);
    }

    /**
     * Create or update diet information for a resident
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,resident_id',
            'diet_type' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Check if diet already exists for this resident
        $existingDiet = Diet::where('resident_id', $validated['resident_id'])->first();

        if ($existingDiet) {
            // Update existing diet
            $existingDiet->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Dieet succesvol bijgewerkt',
                'data' => $existingDiet->load('resident')
            ]);
        }

        // Create new diet
        $diet = Diet::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Dieet succesvol aangemaakt',
            'data' => $diet->load('resident')
        ], 201);
    }

    /**
     * Update diet information
     */
    public function update(Request $request, $id)
    {
        $diet = Diet::find($id);

        if (!$diet) {
            return response()->json([
                'success' => false,
                'message' => 'Dieet niet gevonden'
            ], 404);
        }

        $validated = $request->validate([
            'diet_type' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $diet->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Dieet succesvol bijgewerkt',
            'data' => $diet->load('resident')
        ]);
    }

    /**
     * Delete diet information
     */
    public function destroy($id)
    {
        $diet = Diet::find($id);

        if (!$diet) {
            return response()->json([
                'success' => false,
                'message' => 'Dieet niet gevonden'
            ], 404);
        }

        $diet->delete();

        return response()->json([
            'success' => true,
            'message' => 'Dieet succesvol verwijderd'
        ]);
    }
}
