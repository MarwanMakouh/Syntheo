<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MedicationRoundSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('medication_rounds')->insert([
            [
                'round_id' => 1,
                'schedule_id' => 1,
                'res_medication_id' => 1,
                'resident_id' => 1,
                'status' => 'Toegediend',
                'notes' => 'Zonder problemen ingenomen',
                'given_by' => 2,
                'given_at' => now()->setTime(8, 5),
            ],
            [
                'round_id' => 2,
                'schedule_id' => 3,
                'res_medication_id' => 2,
                'resident_id' => 1,
                'status' => 'Toegediend',
                'notes' => null,
                'given_by' => 2,
                'given_at' => now()->setTime(7, 10),
            ],
            [
                'round_id' => 3,
                'schedule_id' => 4,
                'res_medication_id' => 3,
                'resident_id' => 2,
                'status' => 'Gemist',
                'notes' => 'Bewoner sliep al',
                'given_by' => 3,
                'given_at' => null,
            ],
            [
                'round_id' => 4,
                'schedule_id' => 5,
                'res_medication_id' => 4,
                'resident_id' => 3,
                'status' => 'Geweigerd',
                'notes' => 'Bewoner voelde zich goed, wilde geen pijnstiller',
                'given_by' => 2,
                'given_at' => null,
            ],
            [
                'round_id' => 5,
                'schedule_id' => 7,
                'res_medication_id' => 6,
                'resident_id' => 4,
                'status' => 'Toegediend',
                'notes' => 'Met het avondeten toegediend',
                'given_by' => 3,
                'given_at' => now()->setTime(18, 15),
            ],
        ]);
    }
}
