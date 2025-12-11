<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResScheduleSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('res_schedule')->insert([
            // Metformine voor Maria Peeters
            [
                'schedule_id' => 1,
                'res_medication_id' => 1,
                'dosage' => '500mg',
                'instructions' => 'Met ontbijt innemen',
                'time_of_day' => '08:00:00',
                'day_of_week' => 'Dagelijks',
            ],
            [
                'schedule_id' => 2,
                'res_medication_id' => 1,
                'dosage' => '500mg',
                'instructions' => 'Met avondeten innemen',
                'time_of_day' => '18:00:00',
                'day_of_week' => 'Dagelijks',
            ],
            // Ramipril voor Maria Peeters
            [
                'schedule_id' => 3,
                'res_medication_id' => 2,
                'dosage' => '5mg',
                'instructions' => 'Op nuchtere maag',
                'time_of_day' => '07:00:00',
                'day_of_week' => 'Dagelijks',
            ],
            // Simvastatine voor Jozef Willems
            [
                'schedule_id' => 4,
                'res_medication_id' => 3,
                'dosage' => '40mg',
                'instructions' => 'Voor het slapen gaan',
                'time_of_day' => '21:00:00',
                'day_of_week' => 'Dagelijks',
            ],
            // Paracetamol voor Anna Claes
            [
                'schedule_id' => 5,
                'res_medication_id' => 4,
                'dosage' => '1000mg',
                'instructions' => 'Bij pijn, max 4x per dag',
                'time_of_day' => '09:00:00',
                'day_of_week' => 'Dagelijks',
            ],
            // Omeprazol voor Jozef Willems
            [
                'schedule_id' => 6,
                'res_medication_id' => 5,
                'dosage' => '20mg',
                'instructions' => 'Voor het ontbijt',
                'time_of_day' => '07:30:00',
                'day_of_week' => 'Dagelijks',
            ],
            // Rivaroxaban voor Frans Mertens
            [
                'schedule_id' => 7,
                'res_medication_id' => 6,
                'dosage' => '20mg',
                'instructions' => 'Met avondeten',
                'time_of_day' => '18:00:00',
                'day_of_week' => 'Dagelijks',
            ],
        ]);
    }
}
