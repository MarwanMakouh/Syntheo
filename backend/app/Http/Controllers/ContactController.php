<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    /**
     * Get all contacts for a specific resident
     */
    public function index($residentId)
    {
        $contacts = Contact::where('resident_id', $residentId)
            ->with('resident')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $contacts
        ]);
    }

    /**
     * Get a specific contact by ID
     */
    public function show($id)
    {
        $contact = Contact::with('resident')->find($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Contact niet gevonden'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $contact
        ]);
    }

    /**
     * Create a new contact for a resident
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,resident_id',
            'name' => 'required|string|max:255',
            'relation' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'is_primary' => 'boolean',
        ]);

        $contact = Contact::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Contact succesvol aangemaakt',
            'data' => $contact->load('resident')
        ], 201);
    }

    /**
     * Update contact information
     */
    public function update(Request $request, $id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Contact niet gevonden'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'relation' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:255',
            'email' => 'nullable|email|max:255',
            'is_primary' => 'boolean',
        ]);

        $contact->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Contact succesvol bijgewerkt',
            'data' => $contact->load('resident')
        ]);
    }

    /**
     * Delete a contact
     */
    public function destroy($id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json([
                'success' => false,
                'message' => 'Contact niet gevonden'
            ], 404);
        }

        $contactName = $contact->name;
        $contact->delete();

        return response()->json([
            'success' => true,
            'message' => "Contact '{$contactName}' succesvol verwijderd"
        ]);
    }
}
