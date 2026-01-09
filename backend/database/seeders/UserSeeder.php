<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            // Admin
            [
                'user_id' => 1,
                'email' => 'admin@syntheo.be',
                'password' => Hash::make('password123'),
                'name' => 'Koen Vermeulen',
                'role' => 'Beheerder',
                'floor_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Hoofdverpleger
            [
                'user_id' => 2,
                'email' => 'hoofdverpleger@syntheo.be',
                'password' => Hash::make('password123'),
                'name' => 'Sophie De Clerck',
                'role' => 'Hoofdverpleegster',
                'floor_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Verplegers
            [
                'user_id' => 3,
                'email' => 'verpleger1@syntheo.be',
                'password' => Hash::make('password123'),
                'name' => 'Lisa Van den Berg',
                'role' => 'Verpleegster',
                'floor_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 4,
                'email' => 'verpleger2@syntheo.be',
                'password' => Hash::make('password123'),
                'name' => 'Thomas Janssens',
                'role' => 'Verpleger',
                'floor_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 5,
                'email' => 'verpleger3@syntheo.be',
                'password' => Hash::make('password123'),
                'name' => 'Emma Peeters',
                'role' => 'Verpleegster',
                'floor_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 6,
                'email' => 'verpleger4@syntheo.be',
                'password' => Hash::make('password123'),
                'name' => 'Kevin Willems',
                'role' => 'Verpleger',
                'floor_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 7,
                'email' => 'verpleger5@syntheo.be',
                'password' => Hash::make('password123'),
                'name' => 'Marie Dubois',
                'role' => 'Verpleegster',
                'floor_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Keukenpersoneel
            [
                'user_id' => 8,
                'email' => 'keuken@syntheo.be',
                'password' => Hash::make('password123'),
                'name' => 'Marc De Vos',
                'role' => 'Keukenpersoneel',
                'floor_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
