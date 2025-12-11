<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Get all rooms with their floor and resident information
     */
    public function index()
    {
        $rooms = Room::with(['floor', 'resident'])->get();

        return response()->json([
            'success' => true,
            'data' => $rooms
        ]);
    }

    /**
     * Get a specific room by ID
     */
    public function show($id)
    {
        $room = Room::with(['floor', 'resident'])->find($id);

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Kamer niet gevonden'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $room
        ]);
    }

    /**
     * Unlink a resident from a room (for admin use)
     */
    public function unlinkResident($id)
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Kamer niet gevonden'
            ], 404);
        }

        $room->resident_id = null;
        $room->save();

        return response()->json([
            'success' => true,
            'message' => 'Bewoner succesvol ontkoppeld van kamer',
            'data' => $room
        ]);
    }

    /**
     * Link a resident to a room
     */
    public function linkResident(Request $request, $id)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,resident_id'
        ]);

        $room = Room::find($id);

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Kamer niet gevonden'
            ], 404);
        }

        $room->resident_id = $validated['resident_id'];
        $room->save();

        return response()->json([
            'success' => true,
            'message' => 'Bewoner succesvol gekoppeld aan kamer',
            'data' => $room->load('resident')
        ]);
    }

    /**
     * Update room information
     */
    public function update(Request $request, $id)
    {
        $room = Room::find($id);

        if (!$room) {
            return response()->json([
                'success' => false,
                'message' => 'Kamer niet gevonden'
            ], 404);
        }

        $validated = $request->validate([
            'floor_id' => 'sometimes|exists:floors,floor_id',
            'resident_id' => 'nullable|exists:residents,resident_id',
            'room_number' => 'sometimes|string'
        ]);

        $room->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Kamer succesvol bijgewerkt',
            'data' => $room->load(['floor', 'resident'])
        ]);
    }
}
