<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChangeFieldSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('change_fields')->insert([
            // Voor change_request 1 (goedgekeurd)
            [
                'field_id' => 1,
                'request_id' => 1,
                'field_name' => 'medication_dosage',
                'old' => '500mg',
                'new' => '1000mg',
            ],
            [
                'field_id' => 2,
                'request_id' => 1,
                'field_name' => 'medication_frequency',
                'old' => '2x per dag',
                'new' => '3x per dag',
            ],
            // Voor change_request 2 (in afwachting)
            [
                'field_id' => 3,
                'request_id' => 2,
                'field_name' => 'diet_type',
                'old' => 'Zoutarm',
                'new' => 'Zoutarm en vetarm',
            ],
            // Voor change_request 3 (afgewezen)
            [
                'field_id' => 4,
                'request_id' => 3,
                'field_name' => 'room_number',
                'old' => '201',
                'new' => '105',
            ],
        ]);
    }
}
