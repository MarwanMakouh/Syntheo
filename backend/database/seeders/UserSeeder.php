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
            [
                'user_id' => 1,
                'email' => 'admin@syntheo.be',
                'password' => Hash::make('password123'),
                'name' => 'Jan Administrateur',
                'role' => 'admin',
                'floor_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 2,
                'email' => 'verpleegkundige1@syntheo.be',
                'password' => Hash::make('password123'),
                'name' => 'Sarah Verhoeven',
                'role' => 'verpleegkundige',
                'floor_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 3,
                'email' => 'verpleegkundige2@syntheo.be',
                'password' => Hash::make('password123'),
                'name' => 'Tom Janssens',
                'role' => 'verpleegkundige',
                'floor_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => 4,
                'email' => 'dokter@syntheo.be',
                'password' => Hash::make('password123'),
                'name' => 'Dr. Emma De Vries',
                'role' => 'dokter',
                'floor_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
