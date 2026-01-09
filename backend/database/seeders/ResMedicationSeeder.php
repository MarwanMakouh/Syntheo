<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResMedicationSeeder extends Seeder
{
    public function run(): void
    {
        $medications = [
            // [id, med_id, res_id, months_ago]
            [1, 6, 1, 8], [2, 2, 1, 10], [3, 9, 1, 6], // Resident 1
            [4, 23, 2, 12], [5, 4, 2, 15], [6, 1, 2, 14], // Resident 2
            [7, 14, 3, 5], [8, 15, 3, 3], [9, 11, 3, 4], // Resident 3
            [10, 21, 4, 18], [11, 2, 4, 20], [12, 19, 4, 6], // Resident 4
            [13, 6, 5, 9], [14, 18, 5, 4], [15, 26, 5, 12], // Resident 5
            [16, 6, 6, 11], [17, 10, 6, 8], [18, 5, 6, 7], // Resident 6
            [19, 3, 7, 13], [20, 17, 7, 5], [21, 20, 7, 3], // Resident 7
            [22, 27, 8, 16], [23, 28, 8, 14], [24, 1, 8, 10], // Resident 8
            [25, 26, 9, 24], [26, 14, 9, 6], [27, 13, 9, 2], // Resident 9
            [28, 21, 10, 22], [29, 22, 10, 8], [30, 9, 10, 15], // Resident 10
            [31, 2, 11, 11], [32, 10, 11, 9], // Resident 11
            [33, 7, 12, 7], [34, 25, 12, 36], [35, 11, 12, 5], // Resident 12
            [36, 21, 13, 10], [37, 18, 13, 6], // Resident 13
            [38, 23, 14, 14], [39, 4, 14, 16], [40, 3, 14, 12], // Resident 14
            [41, 14, 15, 8], [42, 12, 15, 6], // Resident 15
            [43, 5, 16, 18], [44, 9, 16, 18], [45, 2, 16, 18], // Resident 16
            [46, 17, 17, 7], [47, 20, 17, 5], // Resident 17
            [48, 8, 18, 10], [49, 28, 18, 12], [50, 27, 18, 12], // Resident 18
            [51, 1, 19, 9], [52, 15, 19, 4], // Resident 19
            [53, 23, 20, 20], [54, 21, 20, 15], [55, 1, 20, 18], // Resident 20
            [56, 26, 21, 20], [57, 18, 21, 8], // Resident 21
            [58, 6, 22, 13], [59, 9, 22, 11], [60, 2, 22, 14], // Resident 22
            [61, 3, 23, 10], [62, 14, 23, 7], // Resident 23
            [63, 4, 24, 17], [64, 13, 24, 4], // Resident 24
            [65, 24, 25, 8], [66, 20, 25, 3], // Resident 25
        ];

        $data = [];
        foreach ($medications as $med) {
            $data[] = [
                'res_medication_id' => $med[0],
                'medication_id' => $med[1],
                'resident_id' => $med[2],
                'is_active' => true,
                'end_date' => null,
                'created_at' => now()->subMonths($med[3]),
                'updated_at' => now(),
            ];
        }

        DB::table('res_medication')->insert($data);
    }
}
