<?php

namespace App\Http\Controllers;

use App\Models\Floor;
use Illuminate\Http\Request;

class FloorController extends Controller
{
    /**
     * Get all floors with their rooms
     */
    public function index()
    {
        $floors = Floor::with('rooms')->get();

        return response()->json([
            'success' => true,
            'data' => $floors
        ]);
    }

    /**
     * Get a specific floor by ID
     */
    public function show($id)
    {
        $floor = Floor::with('rooms')->find($id);

        if (!$floor) {
            return response()->json([
                'success' => false,
                'message' => 'Verdieping niet gevonden'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $floor
        ]);
    }

    /**
     * Create a new floor
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $floor = Floor::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Verdieping succesvol aangemaakt',
            'data' => $floor
        ], 201);
    }

    /**
     * Update floor information
     */
    public function update(Request $request, $id)
    {
        $floor = Floor::find($id);

        if (!$floor) {
            return response()->json([
                'success' => false,
                'message' => 'Verdieping niet gevonden'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $floor->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Verdieping succesvol bijgewerkt',
            'data' => $floor
        ]);
    }

    /**
     * Delete a floor
     */
    public function destroy($id)
    {
        $floor = Floor::find($id);

        if (!$floor) {
            return response()->json([
                'success' => false,
                'message' => 'Verdieping niet gevonden'
            ], 404);
        }

        $floorName = $floor->name;
        $floor->delete();

        return response()->json([
            'success' => true,
            'message' => "Verdieping '{$floorName}' succesvol verwijderd"
        ]);
    }
}
