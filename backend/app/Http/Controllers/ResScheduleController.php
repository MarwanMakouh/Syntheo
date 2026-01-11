<?php

namespace App\Http\Controllers;

use App\Models\ResSchedule;
use Illuminate\Http\Request;

class ResScheduleController extends Controller
{
    /**
     * Get all schedules for a specific resident medication
     */
    public function index($resMedicationId)
    {
        $schedules = ResSchedule::where('res_medication_id', $resMedicationId)
            ->with(['resMedication', 'medicationRounds'])
            ->get();

        return response()->json([
            'success' => true,
            'data' => $schedules
        ]);
    }

    /**
     * Get a specific schedule by ID
     */
    public function show($id)
    {
        $schedule = ResSchedule::with(['resMedication', 'medicationRounds'])->find($id);

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'Schema niet gevonden'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $schedule
        ]);
    }

    /**
     * Create a new medication schedule
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'res_medication_id' => 'required|exists:res_medication,res_medication_id',
            'dosage' => 'required|string|max:255',
            'instructions' => 'nullable|string',
            'time_of_day' => 'required|string|in:Ochtend,Middag,Avond,Nacht',
            'day_of_week' => 'required|string|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday,daily',
        ]);

        $schedule = ResSchedule::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Schema succesvol aangemaakt',
            'data' => $schedule->load('resMedication')
        ], 201);
    }

    /**
     * Update schedule information
     */
    public function update(Request $request, $id)
    {
        $schedule = ResSchedule::find($id);

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'Schema niet gevonden'
            ], 404);
        }

        $validated = $request->validate([
            'dosage' => 'sometimes|string|max:255',
            'instructions' => 'nullable|string',
            'time_of_day' => 'sometimes|string|in:Ochtend,Middag,Avond,Nacht',
            'day_of_week' => 'sometimes|string|in:monday,tuesday,wednesday,thursday,friday,saturday,sunday,daily',
        ]);

        $schedule->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Schema succesvol bijgewerkt',
            'data' => $schedule->load('resMedication')
        ]);
    }

    /**
     * Delete a schedule
     */
    public function destroy($id)
    {
        $schedule = ResSchedule::find($id);

        if (!$schedule) {
            return response()->json([
                'success' => false,
                'message' => 'Schema niet gevonden'
            ], 404);
        }

        $schedule->delete();

        return response()->json([
            'success' => true,
            'message' => 'Schema succesvol verwijderd'
        ]);
    }
}
