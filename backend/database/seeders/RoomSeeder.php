<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [];
        $residentId = 1;

        // Floor 1 (Verdieping 1) - Kamers 101-110
        for ($i = 1; $i <= 10; $i++) {
            $rooms[] = [
                'floor_id' => 1,
                'resident_id' => ($i <= 8) ? $residentId++ : null, // 8 bewoners, 2 leeg
                'room_number' => '1' . sprintf('%02d', $i),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Floor 2 (Verdieping 2) - Kamers 201-210
        for ($i = 1; $i <= 10; $i++) {
            $rooms[] = [
                'floor_id' => 2,
                'resident_id' => ($i <= 9) ? $residentId++ : null, // 9 bewoners, 1 leeg
                'room_number' => '2' . sprintf('%02d', $i),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Floor 3 (Verdieping 3) - Kamers 301-310
        for ($i = 1; $i <= 10; $i++) {
            $rooms[] = [
                'floor_id' => 3,
                'resident_id' => ($i <= 8) ? $residentId++ : null, // 8 bewoners, 2 leeg
                'room_number' => '3' . sprintf('%02d', $i),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('rooms')->insert($rooms);
    }
}
