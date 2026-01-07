<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('rooms')->insert([
            // Floor 2 (Eerste verdieping) - Kamers 101-120
            [
                'floor_id' => 2,
                'resident_id' => 1, // Maria Peeters
                'room_number' => '101',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'floor_id' => 2,
                'resident_id' => 2, // Jozef Willems
                'room_number' => '102',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'floor_id' => 2,
                'resident_id' => null, // Leeg
                'room_number' => '103',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'floor_id' => 2,
                'resident_id' => null, // Leeg
                'room_number' => '104',
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Floor 3 (Tweede verdieping) - Kamers 201-220
            [
                'floor_id' => 3,
                'resident_id' => 3, // Anna Claes
                'room_number' => '201',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'floor_id' => 3,
                'resident_id' => 4, // Frans Mertens
                'room_number' => '202',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'floor_id' => 3,
                'resident_id' => null, // Leeg
                'room_number' => '203',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'floor_id' => 3,
                'resident_id' => null, // Leeg
                'room_number' => '204',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
