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
                'time_of_day' => 'Ochtend', // Changed from '08:00:00' to 'Ochtend'
                'day_of_week' => null, // Changed from 'Dagelijks' to null (null = daily)
            ],
            [
                'schedule_id' => 2,
                'res_medication_id' => 1,
                'dosage' => '500mg',
                'instructions' => 'Met avondeten innemen',
                'time_of_day' => 'Avond', // Changed from '18:00:00' to 'Avond'
                'day_of_week' => null, // Changed from 'Dagelijks' to null (null = daily)
            ],
            // Ramipril voor Maria Peeters
            [
                'schedule_id' => 3,
                'res_medication_id' => 2,
                'dosage' => '5mg',
                'instructions' => 'Op nuchtere maag',
                'time_of_day' => 'Ochtend', // Changed from '07:00:00' to 'Ochtend'
                'day_of_week' => null, // Changed from 'Dagelijks' to null (null = daily)
            ],
            // Simvastatine voor Jozef Willems
            [
                'schedule_id' => 4,
                'res_medication_id' => 3,
                'dosage' => '40mg',
                'instructions' => 'Voor het slapen gaan',
                'time_of_day' => 'Nacht', // Changed from '21:00:00' to 'Nacht'
                'day_of_week' => null, // Changed from 'Dagelijks' to null (null = daily)
            ],
            // Paracetamol voor Anna Claes
            [
                'schedule_id' => 5,
                'res_medication_id' => 4,
                'dosage' => '1000mg',
                'instructions' => 'Bij pijn, max 4x per dag',
                'time_of_day' => 'Ochtend', // Changed from '09:00:00' to 'Ochtend'
                'day_of_week' => null, // Changed from 'Dagelijks' to null (null = daily)
            ],
            // Omeprazol voor Jozef Willems
            [
                'schedule_id' => 6,
                'res_medication_id' => 5,
                'dosage' => '20mg',
                'instructions' => 'Voor het ontbijt',
                'time_of_day' => 'Ochtend', // Changed from '07:30:00' to 'Ochtend'
                'day_of_week' => null, // Changed from 'Dagelijks' to null (null = daily)
            ],
            // Rivaroxaban voor Frans Mertens
            [
                'schedule_id' => 7,
                'res_medication_id' => 6,
                'dosage' => '20mg',
                'instructions' => 'Met avondeten',
                'time_of_day' => 'Avond', // Changed from '18:00:00' to 'Avond'
                'day_of_week' => null, // Changed from 'Dagelijks' to null (null = daily)
            ],
        ]);
    }
}
