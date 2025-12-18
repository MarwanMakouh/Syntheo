<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Get all users (voor beheerder)
     */
    public function index()
    {
        $users = User::with('floor')->get();

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Get a specific user by ID
     */
    public function show($id)
    {
        $user = User::with('floor')->find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Gebruiker niet gevonden'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    /**
     * Create a new user (voor beheerder)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|string|in:admin,nurse,doctor,caregiver',
            'floor_id' => 'nullable|exists:floors,floor_id'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'floor_id' => $validated['floor_id'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Gebruiker succesvol aangemaakt',
            'data' => $user->load('floor')
        ], 201);
    }

    /**
     * Update user information (voor beheerder)
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Gebruiker niet gevonden'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('users', 'email')->ignore($user->user_id, 'user_id')
            ],
            'password' => 'sometimes|string|min:6',
            'role' => 'sometimes|string|in:admin,nurse,doctor,caregiver',
            'floor_id' => 'nullable|exists:floors,floor_id'
        ]);

        // Update password only if provided
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Gebruiker succesvol bijgewerkt',
            'data' => $user->load('floor')
        ]);
    }

    /**
     * Delete a user (voor beheerder)
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Gebruiker niet gevonden'
            ], 404);
        }

        $userName = $user->name;
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => "Gebruiker '{$userName}' succesvol verwijderd"
        ]);
    }
}
