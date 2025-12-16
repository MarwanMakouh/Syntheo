<?php

namespace App\Http\Controllers;

use App\Models\MedicationLibrary;
use Illuminate\Http\Request;

class MedicationLibraryController extends Controller
{
    /**
     * Get all medications from the library
     * Supports optional filtering by category
     */
    public function index(Request $request)
    {
        $query = MedicationLibrary::query();

        // Filter by category if provided
        if ($request->has('category') && $request->category) {
            $query->where('category', $request->category);
        }

        // Search by name if provided
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $medications = $query->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $medications
        ]);
    }

    /**
     * Get a specific medication by ID
     */
    public function show($id)
    {
        $medication = MedicationLibrary::find($id);

        if (!$medication) {
            return response()->json([
                'success' => false,
                'message' => 'Medicijn niet gevonden'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $medication
        ]);
    }

    /**
     * Create a new medication in the library
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
        ]);

        $validated['created_at'] = now();

        $medication = MedicationLibrary::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Medicijn succesvol aangemaakt',
            'data' => $medication
        ], 201);
    }

    /**
     * Update medication information
     */
    public function update(Request $request, $id)
    {
        $medication = MedicationLibrary::find($id);

        if (!$medication) {
            return response()->json([
                'success' => false,
                'message' => 'Medicijn niet gevonden'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:255',
        ]);

        $medication->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Medicijn succesvol bijgewerkt',
            'data' => $medication
        ]);
    }

    /**
     * Delete a medication from the library
     */
    public function destroy($id)
    {
        $medication = MedicationLibrary::find($id);

        if (!$medication) {
            return response()->json([
                'success' => false,
                'message' => 'Medicijn niet gevonden'
            ], 404);
        }

        $medicationName = $medication->name;
        $medication->delete();

        return response()->json([
            'success' => true,
            'message' => "Medicijn '{$medicationName}' succesvol verwijderd"
        ]);
    }
}
