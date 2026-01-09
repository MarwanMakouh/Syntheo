<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $schedules = [];
        $id = 1;

        // Common medication schedules based on medication type
        $medSchedules = [
            6 => [['Ochtend', '500mg', 'Met ontbijt'], ['Avond', '500mg', 'Met avondeten']], // Metformine 2x
            7 => [['Ochtend', '80mg', 'Met ontbijt']], // Gliclazide
            8 => [['Avond', '20 eenheden', 'Voor het slapen']], // Insuline
            2 => [['Ochtend', '5mg', 'Op nuchtere maag']], // Ramipril
            1 => [['Ochtend', '50mg', 'Met ontbijt']], // Metoprolol
            3 => [['Ochtend', '5mg', 'Met ontbijt']], // Bisoprolol
            9 => [['Nacht', '40mg', 'Voor het slapen']], // Simvastatine
            10 => [['Nacht', '20mg', 'Voor het slapen']], // Atorvastatine
            23 => [['Ochtend', '40mg', 'Voor het ontbijt']], // Furosemide
            24 => [['Ochtend', '25mg', 'Met ontbijt']], // Hydrochloorthiazide
            4 => [['Avond', '20mg', 'Met avondeten']], // Rivaroxaban
            5 => [['Ochtend', '80mg', 'Met ontbijt']], // Aspirine
            14 => [['Ochtend', '1000mg', 'Bij pijn'], ['Middag', '1000mg', 'Bij pijn'], ['Avond', '1000mg', 'Bij pijn']], // Paracetamol
            15 => [['Ochtend', '50mg', 'Bij pijn'], ['Avond', '50mg', 'Bij pijn']], // Tramadol
            16 => [['Middag', '50mg', 'Met lunch']], // Diclofenac
            11 => [['Ochtend', '20mg', 'Voor het ontbijt']], // Omeprazol
            12 => [['Ochtend', '40mg', 'Voor het ontbijt']], // Pantoprazol
            13 => [['Ochtend', '1 sachet', 'In water oplossen']], // Macrogol
            17 => [['Middag', '1mg', 'Bij angst']], // Lorazepam
            18 => [['Nacht', '30mg', 'Voor het slapen']], // Mirtazapine
            19 => [['Nacht', '25mg', 'Voor het slapen']], // Quetiapine
            20 => [['Nacht', '10mg', 'Voor het slapen']], // Temazepam
            21 => [['Ochtend', '10mg', 'Met ontbijt']], // Donepezil
            22 => [['Ochtend', '10mg', 'Met ontbijt']], // Memantine
            25 => [['Ochtend', '75mcg', 'Op nuchtere maag']], // Levothyroxine
            26 => [['Avond', '1 tablet', 'Met avondeten']], // Calcium/Vit D
            27 => [['Ochtend', '2 pufjes', 'Bij benauwdheid'], ['Middag', '2 pufjes', 'Bij benauwdheid']], // Salbutamol
            28 => [['Ochtend', '1 inhalatie', 'Vast schema']], // Tiotropium
        ];

        // Generate schedules for each res_medication entry
        $medications = [
            [1, 6, 1], [2, 2, 1], [3, 9, 1], // Resident 1
            [4, 23, 2], [5, 4, 2], [6, 1, 2], // Resident 2
            [7, 14, 3], [8, 15, 3], [9, 11, 3], // Resident 3
            [10, 21, 4], [11, 2, 4], [12, 19, 4], // Resident 4
            [13, 6, 5], [14, 18, 5], [15, 26, 5], // Resident 5
            [16, 6, 6], [17, 10, 6], [18, 5, 6], // Resident 6
            [19, 3, 7], [20, 17, 7], [21, 20, 7], // Resident 7
            [22, 27, 8], [23, 28, 8], [24, 1, 8], // Resident 8
            [25, 26, 9], [26, 14, 9], [27, 13, 9], // Resident 9
            [28, 21, 10], [29, 22, 10], [30, 9, 10], // Resident 10
            [31, 2, 11], [32, 10, 11], // Resident 11
            [33, 7, 12], [34, 25, 12], [35, 11, 12], // Resident 12
            [36, 21, 13], [37, 18, 13], // Resident 13
            [38, 23, 14], [39, 4, 14], [40, 3, 14], // Resident 14
            [41, 14, 15], [42, 12, 15], // Resident 15
            [43, 5, 16], [44, 9, 16], [45, 2, 16], // Resident 16
            [46, 17, 17], [47, 20, 17], // Resident 17
            [48, 8, 18], [49, 28, 18], [50, 27, 18], // Resident 18
            [51, 1, 19], [52, 15, 19], // Resident 19
            [53, 23, 20], [54, 21, 20], [55, 1, 20], // Resident 20
            [56, 26, 21], [57, 18, 21], // Resident 21
            [58, 6, 22], [59, 9, 22], [60, 2, 22], // Resident 22
            [61, 3, 23], [62, 14, 23], // Resident 23
            [63, 4, 24], [64, 13, 24], // Resident 24
            [65, 24, 25], [66, 20, 25], // Resident 25
        ];

        foreach ($medications as $med) {
            $resMedId = $med[0];
            $medId = $med[1];

            if (isset($medSchedules[$medId])) {
                foreach ($medSchedules[$medId] as $sched) {
                    $schedules[] = [
                        'schedule_id' => $id++,
                        'res_medication_id' => $resMedId,
                        'dosage' => $sched[1],
                        'instructions' => $sched[2],
                        'time_of_day' => $sched[0],
                        'day_of_week' => null,
                    ];
                }
            }
        }

        DB::table('res_schedule')->insert($schedules);
    }
}
