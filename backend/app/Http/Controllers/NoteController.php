<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Services\AuditLogger;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    /**
     * Get all notes (for all residents)
     */
    public function all()
    {
        $notes = Note::with(['resident', 'author', 'resolver'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $notes
        ]);
    }

    /**
     * Get all notes for a specific resident
     */
    public function index($residentId)
    {
        $notes = Note::where('resident_id', $residentId)
            ->with(['resident', 'author', 'resolver'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $notes
        ]);
    }

    /**
     * Get a specific note by ID
     */
    public function show($id)
    {
        $note = Note::with(['resident', 'author', 'resolver'])->find($id);

        if (!$note) {
            return response()->json([
                'success' => false,
                'message' => 'Notitie niet gevonden'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $note
        ]);
    }

    /**
     * Create a new note for a resident
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,resident_id',
            'author_id' => 'required|exists:users,user_id',
            'category' => 'required|in:general,health,behavior,medication,social',
            'urgency' => 'required|in:low,medium,high,Laag,Matig,Hoog',
            'content' => 'required|string',
        ]);

        $validated['is_resolved'] = false;
        $validated['created_at'] = now()->format('Y-m-d H:i:s');

        $note = Note::create($validated);

        // Create audit log
        $resident = $note->resident;
        AuditLogger::log(
            'toegevoegd',
            $note,
            $validated['author_id'],
            null,
            null,
            ['message' => 'Nieuwe notitie voor ' . ($resident ? $resident->name : 'Bewoner #' . $note->resident_id)]
        );

        return response()->json([
            'success' => true,
            'message' => 'Notitie succesvol aangemaakt',
            'data' => $note->load(['resident', 'author'])
        ], 201);
    }

    /**
     * Update note information
     */
    public function update(Request $request, $id)
    {
        $note = Note::find($id);

        if (!$note) {
            return response()->json([
                'success' => false,
                'message' => 'Notitie niet gevonden'
            ], 404);
        }

        $validated = $request->validate([
            'category' => 'sometimes|in:general,health,behavior,medication,social',
            'urgency' => 'sometimes|in:low,medium,high,Laag,Matig,Hoog',
            'content' => 'sometimes|string',
        ]);

        $note->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Notitie succesvol bijgewerkt',
            'data' => $note->load(['resident', 'author', 'resolver'])
        ]);
    }

    /**
     * Resolve a note
     */
    public function resolve(Request $request, $id)
    {
        $note = Note::find($id);

        if (!$note) {
            return response()->json([
                'success' => false,
                'message' => 'Notitie niet gevonden'
            ], 404);
        }

        $validated = $request->validate([
            'resolved_by' => 'required|exists:users,user_id',
        ]);

        $note->update([
            'is_resolved' => true,
            'resolved_at' => now(),
            'resolved_by' => $validated['resolved_by'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Notitie succesvol opgelost',
            'data' => $note->load(['resident', 'author', 'resolver'])
        ]);
    }

    /**
     * Unresolve a note
     */
    public function unresolve($id)
    {
        $note = Note::find($id);

        if (!$note) {
            return response()->json([
                'success' => false,
                'message' => 'Notitie niet gevonden'
            ], 404);
        }

        $note->update([
            'is_resolved' => false,
            'resolved_at' => null,
            'resolved_by' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Notitie weer geopend',
            'data' => $note->load(['resident', 'author'])
        ]);
    }

    /**
     * Delete a note
     */
    public function destroy($id)
    {
        $note = Note::find($id);

        if (!$note) {
            return response()->json([
                'success' => false,
                'message' => 'Notitie niet gevonden'
            ], 404);
        }

        // Create audit log before deleting
        $resident = $note->resident;
        AuditLogger::log(
            'verwijderd',
            $note,
            auth()->id(),
            null,
            null,
            ['message' => 'Oude notitie verwijderd voor ' . ($resident ? $resident->name : 'Bewoner #' . $note->resident_id)]
        );

        $note->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notitie succesvol verwijderd'
        ]);
    }
}
