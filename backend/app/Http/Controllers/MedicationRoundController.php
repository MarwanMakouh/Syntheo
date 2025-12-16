<?php

namespace App\Http\Controllers;

use App\Models\MedicationRound;
use Illuminate\Http\Request;

class MedicationRoundController extends Controller
{
    /**
     * Get all medication rounds
     * Supports filtering by resident, status, and date range
     */
    public function index(Request $request)
    {
        $query = MedicationRound::with(['schedule', 'resMedication.medication', 'resident', 'givenBy']);

        // Filter by resident
        if ($request->has('resident_id') && $request->resident_id) {
            $query->where('resident_id', $request->resident_id);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('given_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('given_at', '<=', $request->date_to);
        }

        $rounds = $query->orderBy('given_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $rounds
        ]);
    }

    /**
     * Get a specific medication round by ID
     */
    public function show($id)
    {
        $round = MedicationRound::with(['schedule', 'resMedication.medication', 'resident', 'givenBy'])->find($id);

        if (!$round) {
            return response()->json([
                'success' => false,
                'message' => 'Medicatieronde niet gevonden'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $round
        ]);
    }

    /**
     * Create a new medication round (record medication administration)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'schedule_id' => 'required|exists:res_schedule,schedule_id',
            'res_medication_id' => 'required|exists:res_medication,res_medication_id',
            'resident_id' => 'required|exists:residents,resident_id',
            'status' => 'required|in:given,missed,refused,delayed',
            'notes' => 'nullable|string',
            'given_by' => 'required|exists:users,user_id',
        ]);

        $validated['given_at'] = now();

        $round = MedicationRound::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Medicatieronde succesvol geregistreerd',
            'data' => $round->load(['schedule', 'resMedication.medication', 'resident', 'givenBy'])
        ], 201);
    }

    /**
     * Update medication round information
     */
    public function update(Request $request, $id)
    {
        $round = MedicationRound::find($id);

        if (!$round) {
            return response()->json([
                'success' => false,
                'message' => 'Medicatieronde niet gevonden'
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'sometimes|in:given,missed,refused,delayed',
            'notes' => 'nullable|string',
        ]);

        $round->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Medicatieronde succesvol bijgewerkt',
            'data' => $round->load(['schedule', 'resMedication.medication', 'resident', 'givenBy'])
        ]);
    }

    /**
     * Delete a medication round
     */
    public function destroy($id)
    {
        $round = MedicationRound::find($id);

        if (!$round) {
            return response()->json([
                'success' => false,
                'message' => 'Medicatieronde niet gevonden'
            ], 404);
        }

        $round->delete();

        return response()->json([
            'success' => true,
            'message' => 'Medicatieronde succesvol verwijderd'
        ]);
    }
}
