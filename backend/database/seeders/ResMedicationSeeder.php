<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResMedicationSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('res_medication')->insert([
            [
                'res_medication_id' => 1,
                'medication_id' => 1,
                'resident_id' => 1,
                'is_active' => true,
                'end_date' => null,
                'created_at' => now()->subMonths(3),
                'updated_at' => now(),
            ],
            [
                'res_medication_id' => 2,
                'medication_id' => 2,
                'resident_id' => 1,
                'is_active' => true,
                'end_date' => null,
                'created_at' => now()->subMonths(6),
                'updated_at' => now(),
            ],
            [
                'res_medication_id' => 3,
                'medication_id' => 3,
                'resident_id' => 2,
                'is_active' => true,
                'end_date' => null,
                'created_at' => now()->subMonths(2),
                'updated_at' => now(),
            ],
            [
                'res_medication_id' => 4,
                'medication_id' => 4,
                'resident_id' => 3,
                'is_active' => true,
                'end_date' => null,
                'created_at' => now()->subWeeks(2),
                'updated_at' => now(),
            ],
            [
                'res_medication_id' => 5,
                'medication_id' => 5,
                'resident_id' => 2,
                'is_active' => true,
                'end_date' => null,
                'created_at' => now()->subMonth(),
                'updated_at' => now(),
            ],
            [
                'res_medication_id' => 6,
                'medication_id' => 6,
                'resident_id' => 4,
                'is_active' => true,
                'end_date' => null,
                'created_at' => now()->subMonths(4),
                'updated_at' => now(),
            ],
            // Medicatie voor Maria Visser (resident_id: 5)
            [
                'res_medication_id' => 7,
                'medication_id' => 1, // Metformine
                'resident_id' => 5,
                'is_active' => true,
                'end_date' => null,
                'created_at' => now()->subMonths(2),
                'updated_at' => now(),
            ],
            [
                'res_medication_id' => 8,
                'medication_id' => 3, // Simvastatine
                'resident_id' => 5,
                'is_active' => true,
                'end_date' => null,
                'created_at' => now()->subMonth(),
                'updated_at' => now(),
            ],
        ]);
    }
}
