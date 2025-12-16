<?php

namespace App\Http\Controllers;

use App\Models\ChangeRequest;
use Illuminate\Http\Request;

class ChangeRequestController extends Controller
{
    /**
     * Get all change requests
     * Supports filtering by status, resident, and urgency
     */
    public function index(Request $request)
    {
        $query = ChangeRequest::with(['resident', 'requester', 'reviewer', 'changeFields']);

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter by resident
        if ($request->has('resident_id') && $request->resident_id) {
            $query->where('resident_id', $request->resident_id);
        }

        // Filter by urgency
        if ($request->has('urgency') && $request->urgency) {
            $query->where('urgency', $request->urgency);
        }

        $requests = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $requests
        ]);
    }

    /**
     * Get a specific change request by ID
     */
    public function show($id)
    {
        $changeRequest = ChangeRequest::with(['resident', 'requester', 'reviewer', 'changeFields'])->find($id);

        if (!$changeRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Wijzigingsverzoek niet gevonden'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $changeRequest
        ]);
    }

    /**
     * Create a new change request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,resident_id',
            'requester_id' => 'required|exists:users,user_id',
            'urgency' => 'required|in:low,medium,high',
            'fields' => 'required|array|min:1',
            'fields.*.field_name' => 'required|string',
            'fields.*.old' => 'nullable|string',
            'fields.*.new' => 'required|string',
        ]);

        $validated['status'] = 'pending';
        $validated['created_at'] = now();

        $changeRequest = ChangeRequest::create([
            'resident_id' => $validated['resident_id'],
            'requester_id' => $validated['requester_id'],
            'urgency' => $validated['urgency'],
            'status' => $validated['status'],
            'created_at' => $validated['created_at'],
        ]);

        // Create change fields
        foreach ($validated['fields'] as $field) {
            $changeRequest->changeFields()->create($field);
        }

        return response()->json([
            'success' => true,
            'message' => 'Wijzigingsverzoek succesvol aangemaakt',
            'data' => $changeRequest->load(['resident', 'requester', 'changeFields'])
        ], 201);
    }

    /**
     * Approve a change request
     */
    public function approve(Request $request, $id)
    {
        $changeRequest = ChangeRequest::find($id);

        if (!$changeRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Wijzigingsverzoek niet gevonden'
            ], 404);
        }

        $validated = $request->validate([
            'reviewer_id' => 'required|exists:users,user_id',
        ]);

        $changeRequest->update([
            'status' => 'approved',
            'reviewer_id' => $validated['reviewer_id'],
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Wijzigingsverzoek goedgekeurd',
            'data' => $changeRequest->load(['resident', 'requester', 'reviewer', 'changeFields'])
        ]);
    }

    /**
     * Reject a change request
     */
    public function reject(Request $request, $id)
    {
        $changeRequest = ChangeRequest::find($id);

        if (!$changeRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Wijzigingsverzoek niet gevonden'
            ], 404);
        }

        $validated = $request->validate([
            'reviewer_id' => 'required|exists:users,user_id',
        ]);

        $changeRequest->update([
            'status' => 'rejected',
            'reviewer_id' => $validated['reviewer_id'],
            'reviewed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Wijzigingsverzoek afgewezen',
            'data' => $changeRequest->load(['resident', 'requester', 'reviewer', 'changeFields'])
        ]);
    }

    /**
     * Delete a change request
     */
    public function destroy($id)
    {
        $changeRequest = ChangeRequest::find($id);

        if (!$changeRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Wijzigingsverzoek niet gevonden'
            ], 404);
        }

        $changeRequest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Wijzigingsverzoek succesvol verwijderd'
        ]);
    }
}
