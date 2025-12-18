<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    /**
     * Get all audit logs
     * Supports filtering by entity type, entity ID, user, action, and date range
     */
    public function index(Request $request)
    {
        $query = AuditLog::with('user');

        // Filter by entity type
        if ($request->has('entity_type') && $request->entity_type) {
            $query->where('entity_type', $request->entity_type);
        }

        // Filter by entity ID
        if ($request->has('entity_id') && $request->entity_id) {
            $query->where('entity_id', $request->entity_id);
        }

        // Filter by user
        if ($request->has('user_id') && $request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by action
        if ($request->has('action') && $request->action) {
            $query->where('action', $request->action);
        }

        // Filter by date range
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('timestamp', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('timestamp', '<=', $request->date_to);
        }

        $logs = $query->orderBy('timestamp', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }

    /**
     * Get a specific audit log by ID
     */
    public function show($id)
    {
        $log = AuditLog::with('user')->find($id);

        if (!$log) {
            return response()->json([
                'success' => false,
                'message' => 'Audit log niet gevonden'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $log
        ]);
    }

    /**
     * Create a new audit log entry
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,user_id',
            'entity_type' => 'required|string|max:255',
            'entity_id' => 'required|integer',
            'action' => 'required|in:create,update,delete,view,approve,reject',
            'details' => 'nullable|array',
        ]);

        $validated['timestamp'] = now();

        $log = AuditLog::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Audit log succesvol aangemaakt',
            'data' => $log->load('user')
        ], 201);
    }

    /**
     * Get audit logs for a specific entity
     */
    public function getEntityLogs($entityType, $entityId)
    {
        $logs = AuditLog::where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->with('user')
            ->orderBy('timestamp', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $logs
        ]);
    }
}
