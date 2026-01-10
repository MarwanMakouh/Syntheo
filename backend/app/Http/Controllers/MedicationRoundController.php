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
        $query = MedicationRound::with(['schedule', 'resMedication.medication', 'resident.room', 'givenBy']);

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

    /**
     * Get medication compliance statistics per dagdeel for a specific date
     * Based on residents who have received ALL their medication for a dagdeel
     */
    public function complianceByDagdeel(Request $request)
    {
        $date = $request->get('date', now()->toDateString());
        $dagdelen = ['Ochtend', 'Middag', 'Avond', 'Nacht'];

        $result = [];

        foreach ($dagdelen as $dagdeel) {
            // Get all active schedules for this dagdeel
            $schedules = \App\Models\ResSchedule::where('time_of_day', $dagdeel)
                ->whereHas('resMedication', function($query) {
                    $query->where('is_active', true);
                })
                ->with('resMedication.resident')
                ->get();

            // Group schedules by resident
            $residentSchedules = [];
            foreach ($schedules as $schedule) {
                if ($schedule->resMedication && $schedule->resMedication->resident) {
                    $residentId = $schedule->resMedication->resident_id;

                    if (!isset($residentSchedules[$residentId])) {
                        $residentSchedules[$residentId] = [
                            'total' => 0,
                            'given' => 0
                        ];
                    }

                    $residentSchedules[$residentId]['total']++;

                    // Check if this schedule has ANY round for today (given, refused, or missed)
                    $round = MedicationRound::where('schedule_id', $schedule->schedule_id)
                        ->whereDate('given_at', $date)
                        ->whereIn('status', ['given', 'refused', 'missed'])
                        ->first();

                    if ($round) {
                        $residentSchedules[$residentId]['given']++;
                    }
                }
            }

            // Count residents who have received ALL their medication
            $totalResidents = count($residentSchedules);
            $completedResidents = 0;
            $residentDetails = [];

            foreach ($residentSchedules as $residentId => $stats) {
                $resident = \App\Models\Resident::find($residentId);
                $isComplete = $stats['given'] === $stats['total'];

                if ($isComplete) {
                    $completedResidents++;
                }

                $residentDetails[] = [
                    'resident_id' => $residentId,
                    'name' => $resident ? $resident->name : 'Unknown',
                    'total_schedules' => $stats['total'],
                    'given_schedules' => $stats['given'],
                    'is_complete' => $isComplete
                ];
            }

            $percentage = $totalResidents > 0 ? round(($completedResidents / $totalResidents) * 100) : 0;

            $result[] = [
                'dagdeel' => $dagdeel,
                'total' => $totalResidents,
                'completed' => $completedResidents,
                'percentage' => $percentage,
                'debug_residents' => $residentDetails
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $result
        ]);
    }

    /**
     * Bulk create medication rounds for a resident
     * Used when completing medication round for a resident with multiple medications
     */
    public function bulkStore(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,resident_id',
            'given_by' => 'required|exists:users,user_id',
            'medications' => 'required|array|min:1',
            'medications.*.schedule_id' => 'required|exists:res_schedule,schedule_id',
            'medications.*.res_medication_id' => 'required|exists:res_medication,res_medication_id',
            'medications.*.status' => 'required|in:given,missed,refused,delayed',
            'medications.*.notes' => 'nullable|string',
        ]);

        $rounds = [];
        $givenAt = now();

        foreach ($validated['medications'] as $medication) {
            $round = MedicationRound::create([
                'schedule_id' => $medication['schedule_id'],
                'res_medication_id' => $medication['res_medication_id'],
                'resident_id' => $validated['resident_id'],
                'status' => $medication['status'],
                'notes' => $medication['notes'] ?? null,
                'given_by' => $validated['given_by'],
                'given_at' => $givenAt,
            ]);

            $rounds[] = $round->load(['schedule', 'resMedication.medication']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Medicatieronde succesvol geregistreerd',
            'data' => $rounds
        ], 201);
    }
}
