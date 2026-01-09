<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MedicationRoundSeeder extends Seeder
{
    public function run(): void
    {
        $rounds = [];
        $id = 1;
        $nurses = [3, 4, 5, 6, 7]; // Nurse IDs
        $statuses = ['Toegediend', 'Toegediend', 'Toegediend', 'Toegediend', 'Toegediend', 'Geweigerd', 'Gemist'];
        $notes = [
            'Zonder problemen ingenomen',
            'Met water ingenomen',
            'Met maaltijd toegediend',
            null,
            'Bewoner nam medicatie zelfstandig in',
        ];

        // Generate medication rounds for the last 3 days for a selection of schedules
        // We'll create rounds for first 30 schedules (covering multiple residents)
        for ($day = 0; $day < 3; $day++) {
            for ($schedId = 1; $schedId <= 30; $schedId++) {
                $status = $statuses[array_rand($statuses)];
                $nurse = $nurses[array_rand($nurses)];
                $note = $notes[array_rand($notes)];

                // Determine time based on schedule pattern
                $hour = 8; // Default morning
                if ($schedId % 4 == 0) $hour = 21; // Night
                elseif ($schedId % 4 == 1) $hour = 12; // Noon
                elseif ($schedId % 4 == 2) $hour = 18; // Evening

                $timestamp = ($status === 'Toegediend')
                    ? now()->subDays($day)->setTime($hour, rand(0, 30))
                    : null;

                $rounds[] = [
                    'round_id' => $id++,
                    'schedule_id' => $schedId,
                    'res_medication_id' => $schedId, // Simplified mapping
                    'resident_id' => ceil($schedId / 3), // Distribute across residents
                    'status' => $status,
                    'notes' => ($status !== 'Toegediend') ? ($status === 'Geweigerd' ? 'Bewoner weigerde medicatie' : 'Bewoner sliep') : $note,
                    'given_by' => $nurse,
                    'given_at' => $timestamp,
                ];
            }
        }

        DB::table('medication_rounds')->insert($rounds);
    }
}
