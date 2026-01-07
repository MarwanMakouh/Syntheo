<?php

namespace App\Http\Controllers;

use App\Models\Diet;
use Illuminate\Http\Request;

class DietController extends Controller
{
    /**
     * Get diet overview grouped by diet type for kitchen staff
     * Filters: ?search=naam
     */
    public function kitchenOverview(Request $request)
    {
        $search = $request->input('search', '');

        // Get all diets with residents
        $query = Diet::with(['resident.room']);

        // Filter by resident name if search is provided
        if ($search) {
            $query->whereHas('resident', function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%');
            });
        }

        $diets = $query->get();

        // Group by diet_type
        $groupedDiets = $diets->groupBy('diet_type')->map(function($dietGroup, $dietType) {
            return [
                'diet_type' => $dietType,
                'count' => $dietGroup->count(),
                'residents' => $dietGroup->map(function($diet) {
                    return [
                        'resident_id' => $diet->resident->resident_id,
                        'name' => $diet->resident->name,
                        'room_number' => $diet->resident->room ? $diet->resident->room->room_number : null,
                        'description' => $diet->description,
                        'preferences' => $diet->preferences,
                    ];
                })->values(),
            ];
        })->values();

        return response()->json([
            'success' => true,
            'data' => $groupedDiets
        ]);
    }

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
