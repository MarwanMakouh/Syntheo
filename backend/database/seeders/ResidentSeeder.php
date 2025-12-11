<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResidentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('residents')->insert([
            [
                'resident_id' => 1,
                'name' => 'Maria Peeters',
                'date_of_birth' => '1945-03-15',
                'room_number' => '101',
                'photo_url' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 2,
                'name' => 'Jozef Willems',
                'date_of_birth' => '1938-07-22',
                'room_number' => '102',
                'photo_url' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 3,
                'name' => 'Anna Claes',
                'date_of_birth' => '1950-11-08',
                'room_number' => '201',
                'photo_url' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 4,
                'name' => 'Frans Mertens',
                'date_of_birth' => '1942-01-30',
                'room_number' => '202',
                'photo_url' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
