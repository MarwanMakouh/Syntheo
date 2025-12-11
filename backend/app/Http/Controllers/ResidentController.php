<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use Illuminate\Http\Request;

class ResidentController extends Controller
{
    /**
     * Get all residents with optional filtering and searching
     *
     * Query parameters:
     * - search: search by name
     * - room: filter by room number
     * - allergy: filter by allergy symptom
     */
    public function index(Request $request)
    {
        $query = Resident::with(['room.floor', 'allergies', 'primaryContact', 'diet']);

        // Search by name
        if ($request->has('search') && $request->search) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter by room number
        if ($request->has('room') && $request->room) {
            $query->whereHas('room', function($q) use ($request) {
                $q->where('room_number', $request->room);
            });
        }

        // Filter by allergy
        if ($request->has('allergy') && $request->allergy) {
            $query->whereHas('allergies', function($q) use ($request) {
                $q->where('symptom', 'like', '%' . $request->allergy . '%');
            });
        }

        // Debug info (can be removed later)
        $debug = null;
        if ($request->has('debug')) {
            $debug = [
                'total_residents' => Resident::count(),
                'total_rooms' => \App\Models\Room::count(),
                'residents_with_rooms' => Resident::whereHas('room')->count(),
                'filters_applied' => [
                    'search' => $request->search ?? null,
                    'room' => $request->room ?? null,
                    'allergy' => $request->allergy ?? null,
                ],
            ];
        }

        $residents = $query->get();

        return response()->json([
            'success' => true,
            'data' => $residents,
            'debug' => $debug
        ]);
    }

    /**
     * Get detailed information about a specific resident
     * Includes: allergies, contacts, diet, notes, medications, room
     */
    public function show($id)
    {
        $resident = Resident::with([
            'room.floor',
            'allergies',
            'contacts',
            'diet',
            'notes.author',
            'notes.resolver',
            'medications.medication',
            'medications.schedules'
        ])->find($id);

        if (!$resident) {
            return response()->json([
                'success' => false,
                'message' => 'Bewoner niet gevonden'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $resident
        ]);
    }

    /**
     * Create a new resident
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'photo_url' => 'nullable|string|max:255',
        ]);

        $resident = Resident::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Bewoner succesvol aangemaakt',
            'data' => $resident
        ], 201);
    }

    /**
     * Update resident information
     */
    public function update(Request $request, $id)
    {
        $resident = Resident::find($id);

        if (!$resident) {
            return response()->json([
                'success' => false,
                'message' => 'Bewoner niet gevonden'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'date_of_birth' => 'sometimes|date',
            'photo_url' => 'nullable|string|max:255',
        ]);

        $resident->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Bewoner succesvol bijgewerkt',
            'data' => $resident
        ]);
    }

    /**
     * Delete a resident
     */
    public function destroy($id)
    {
        $resident = Resident::find($id);

        if (!$resident) {
            return response()->json([
                'success' => false,
                'message' => 'Bewoner niet gevonden'
            ], 404);
        }

        $residentName = $resident->name;
        $resident->delete();

        return response()->json([
            'success' => true,
            'message' => "Bewoner '{$residentName}' succesvol verwijderd"
        ]);
    }

    /**
     * Search residents by name
     */
    public function search(Request $request)
    {
        $searchTerm = $request->input('q', '');

        $residents = Resident::with(['room', 'allergies'])
            ->where('name', 'like', '%' . $searchTerm . '%')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $residents
        ]);
    }

    /**
     * Get residents filtered by room
     */
    public function filterByRoom($roomNumber)
    {
        $residents = Resident::with(['room.floor', 'allergies'])
            ->whereHas('room', function($q) use ($roomNumber) {
                $q->where('room_number', $roomNumber);
            })
            ->get();

        return response()->json([
            'success' => true,
            'data' => $residents
        ]);
    }

    /**
     * Get residents filtered by allergy
     */
    public function filterByAllergy($allergySymptom)
    {
        $residents = Resident::with(['room', 'allergies'])
            ->whereHas('allergies', function($q) use ($allergySymptom) {
                $q->where('symptom', 'like', '%' . $allergySymptom . '%');
            })
            ->get();

        return response()->json([
            'success' => true,
            'data' => $residents
        ]);
    }
}
