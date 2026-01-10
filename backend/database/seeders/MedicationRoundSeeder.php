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
        $notes = [
            'Zonder problemen ingenomen',
            'Met water ingenomen',
            'Met maaltijd toegediend',
            null,
            'Bewoner nam medicatie zelfstandig in',
        ];

        // Map of schedule time_of_day to hour
        $timeMap = [
            'Ochtend' => 8,
            'Middag' => 12,
            'Avond' => 18,
            'Nacht' => 21,
        ];

        // Get all schedules to create rounds for
        $schedules = DB::table('res_schedule')->get();

        // Generate medication rounds for the last 7 days
        for ($day = 0; $day < 7; $day++) {
            foreach ($schedules as $schedule) {
                // Get resident_id from res_medication
                $resMed = DB::table('res_medication')->where('res_medication_id', $schedule->res_medication_id)->first();
                if (!$resMed) continue;

                $residentId = $resMed->resident_id;

                // For today (day 0), create more realistic data
                if ($day === 0) {
                    // For Ochtend: 80% given
                    // For Middag: 40% given
                    // For Avond: 20% given (hasn't happened yet mostly)
                    switch($schedule->time_of_day) {
                        case 'Ochtend':
                            $givenProbability = 80;
                            break;
                        case 'Middag':
                            $givenProbability = 40;
                            break;
                        case 'Avond':
                            $givenProbability = 20;
                            break;
                        case 'Nacht':
                            $givenProbability = 0; // Night hasn't happened yet
                            break;
                        default:
                            $givenProbability = 50;
                            break;
                    }

                    // Random chance to give medication
                    if (rand(1, 100) > $givenProbability) {
                        // Don't create a round if medication hasn't been given yet
                        continue;
                    }

                    $status = 'given';
                    // Small chance of refused/missed
                    if (rand(1, 100) <= 10) {
                        $status = rand(0, 1) ? 'refused' : 'missed';
                    }
                } else {
                    // For past days: mostly given
                    $statuses = ['given', 'given', 'given', 'given', 'given', 'given', 'refused', 'missed'];
                    $status = $statuses[array_rand($statuses)];
                }

                $nurse = $nurses[array_rand($nurses)];
                $note = $notes[array_rand($notes)];

                // Determine hour based on time_of_day
                $hour = $timeMap[$schedule->time_of_day] ?? 8;

                // Always set timestamp, even for refused/missed (time when it was recorded)
                $timestamp = now()->subDays($day)->setTime($hour, rand(0, 59));

                $rounds[] = [
                    'round_id' => $id++,
                    'schedule_id' => $schedule->schedule_id,
                    'res_medication_id' => $schedule->res_medication_id,
                    'resident_id' => $residentId,
                    'status' => $status,
                    'notes' => ($status !== 'given') ? ($status === 'refused' ? 'Bewoner weigerde medicatie' : 'Bewoner sliep') : $note,
                    'given_by' => $nurse,
                    'given_at' => $timestamp,
                ];
            }
        }

        DB::table('medication_rounds')->insert($rounds);
    }
}
