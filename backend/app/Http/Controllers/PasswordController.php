<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller
{
    /**
     * Change password for first login
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,user_id',
            'old_password' => 'required|string',
            'new_password' => 'required|string|min:6|different:old_password',
        ]);

        $user = User::find($request->user_id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Gebruiker niet gevonden',
            ], 404);
        }

        // Verify old password
        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Het huidige wachtwoord is onjuist',
            ], 401);
        }

        // Update password and set first_login to false
        $user->password = Hash::make($request->new_password);
        $user->first_login = false;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Wachtwoord succesvol gewijzigd',
        ], 200);
    }
}
