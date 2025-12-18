<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\AnnouncementRecipient;
use App\Models\User;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    /**
     * Get all announcements
     * Supports filtering by recipient type and floor
     */
    public function index(Request $request)
    {
        $query = Announcement::with(['author', 'floor', 'recipients.user']);

        // Filter by recipient type
        if ($request->has('recipient_type') && $request->recipient_type) {
            $query->where('recipient_type', $request->recipient_type);
        }

        // Filter by floor
        if ($request->has('floor_id') && $request->floor_id) {
            $query->where('floor_id', $request->floor_id);
        }

        $announcements = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $announcements
        ]);
    }

    /**
     * Get announcements for a specific user
     */
    public function getUserAnnouncements($userId)
    {
        $user = User::find($userId);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Gebruiker niet gevonden'
            ], 404);
        }

        // Get announcements for this user via recipients table
        $announcements = Announcement::whereHas('recipients', function($q) use ($userId) {
            $q->where('user_id', $userId);
        })->with(['author', 'floor', 'recipients' => function($q) use ($userId) {
            $q->where('user_id', $userId);
        }])->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $announcements
        ]);
    }

    /**
     * Get a specific announcement by ID
     */
    public function show($id)
    {
        $announcement = Announcement::with(['author', 'floor', 'recipients.user'])->find($id);

        if (!$announcement) {
            return response()->json([
                'success' => false,
                'message' => 'Aankondiging niet gevonden'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $announcement
        ]);
    }

    /**
     * Create a new announcement
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'author_id' => 'required|exists:users,user_id',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'recipient_type' => 'required|in:all,role,floor',
            'floor_id' => 'nullable|exists:floors,floor_id',
            'recipient_ids' => 'required|array|min:1',
            'recipient_ids.*' => 'exists:users,user_id',
        ]);

        $validated['created_at'] = now();

        $announcement = Announcement::create([
            'author_id' => $validated['author_id'],
            'title' => $validated['title'],
            'message' => $validated['message'],
            'recipient_type' => $validated['recipient_type'],
            'floor_id' => $validated['floor_id'] ?? null,
            'created_at' => $validated['created_at'],
        ]);

        // Create announcement recipients
        foreach ($validated['recipient_ids'] as $recipientId) {
            AnnouncementRecipient::create([
                'announcement_id' => $announcement->announcement_id,
                'user_id' => $recipientId,
                'is_read' => false,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Aankondiging succesvol aangemaakt',
            'data' => $announcement->load(['author', 'floor', 'recipients.user'])
        ], 201);
    }

    /**
     * Mark an announcement as read for a specific user
     */
    public function markAsRead(Request $request, $id)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,user_id',
        ]);

        $recipient = AnnouncementRecipient::where('announcement_id', $id)
            ->where('user_id', $validated['user_id'])
            ->first();

        if (!$recipient) {
            return response()->json([
                'success' => false,
                'message' => 'Aankondiging niet gevonden voor deze gebruiker'
            ], 404);
        }

        $recipient->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Aankondiging gemarkeerd als gelezen',
            'data' => $recipient
        ]);
    }

    /**
     * Delete an announcement
     */
    public function destroy($id)
    {
        $announcement = Announcement::find($id);

        if (!$announcement) {
            return response()->json([
                'success' => false,
                'message' => 'Aankondiging niet gevonden'
            ], 404);
        }

        $announcement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Aankondiging succesvol verwijderd'
        ]);
    }
}
