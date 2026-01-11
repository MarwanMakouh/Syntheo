<?php

namespace App\Http\Controllers;

use App\Models\ResMedication;
use Illuminate\Http\Request;

class ResMedicationController extends Controller
{
    /**
     * Get all medications for a specific resident
     */
    public function index($residentId)
    {
        $medications = ResMedication::where('resident_id', $residentId)
            ->with(['medication', 'resident', 'schedules'])
            ->orderBy('is_active', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $medications
        ]);
    }

    /**
     * Get a specific resident medication by ID
     */
    public function show($id)
    {
        $resMedication = ResMedication::with(['medication', 'resident', 'schedules'])->find($id);

        if (!$resMedication) {
            return response()->json([
                'success' => false,
                'message' => 'Medicatie niet gevonden'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $resMedication
        ]);
    }

    /**
     * Assign a medication to a resident
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'medication_id' => 'required|exists:medication_library,medication_id',
            'resident_id' => 'required|exists:residents,resident_id',
            'is_active' => 'boolean',
            'end_date' => 'nullable|date',
        ]);

        $validated['is_active'] = $validated['is_active'] ?? true;

        $resMedication = ResMedication::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Medicatie succesvol toegewezen aan bewoner',
            'data' => $resMedication->load(['medication', 'resident'])
        ], 201);
    }

    /**
     * Update resident medication information
     */
    public function update(Request $request, $id)
    {
        $resMedication = ResMedication::find($id);

        if (!$resMedication) {
            return response()->json([
                'success' => false,
                'message' => 'Medicatie niet gevonden'
            ], 404);
        }

        $validated = $request->validate([
            'is_active' => 'sometimes|boolean',
            'end_date' => 'nullable|date',
        ]);

        $resMedication->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Medicatie succesvol bijgewerkt',
            'data' => $resMedication->load(['medication', 'resident', 'schedules'])
        ]);
    }

    /**
     * Deactivate a resident medication
     */
    public function deactivate($id)
    {
        $resMedication = ResMedication::find($id);

        if (!$resMedication) {
            return response()->json([
                'success' => false,
                'message' => 'Medicatie niet gevonden'
            ], 404);
        }

        $resMedication->update([
            'is_active' => false,
            'end_date' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Medicatie succesvol gedeactiveerd',
            'data' => $resMedication->load(['medication', 'resident', 'schedules'])
        ]);
    }

    /**
     * Activate a resident medication
     */
    public function activate($id)
    {
        $resMedication = ResMedication::find($id);

        if (!$resMedication) {
            return response()->json([
                'success' => false,
                'message' => 'Medicatie niet gevonden'
            ], 404);
        }

        $resMedication->update([
            'is_active' => true,
            'end_date' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Medicatie succesvol geactiveerd',
            'data' => $resMedication->load(['medication', 'resident', 'schedules'])
        ]);
    }

    /**
     * Delete a resident medication
     */
    public function destroy($id)
    {
        $resMedication = ResMedication::find($id);

        if (!$resMedication) {
            return response()->json([
                'success' => false,
                'message' => 'Medicatie niet gevonden'
            ], 404);
        }

        $resMedication->delete();

        return response()->json([
            'success' => true,
            'message' => 'Medicatie succesvol verwijderd'
        ]);
    }
}
