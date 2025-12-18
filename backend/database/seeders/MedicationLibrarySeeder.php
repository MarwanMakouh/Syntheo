<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MedicationLibrarySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('medication_library')->insert([
            [
                'medication_id' => 1,
                'name' => 'Metformine',
                'category' => 'Diabetes',
                'created_at' => now(),
            ],
            [
                'medication_id' => 2,
                'name' => 'Ramipril',
                'category' => 'Bloeddruk',
                'created_at' => now(),
            ],
            [
                'medication_id' => 3,
                'name' => 'Simvastatine',
                'category' => 'Cholesterol',
                'created_at' => now(),
            ],
            [
                'medication_id' => 4,
                'name' => 'Paracetamol',
                'category' => 'Pijnstiller',
                'created_at' => now(),
            ],
            [
                'medication_id' => 5,
                'name' => 'Omeprazol',
                'category' => 'Maagzuurremmer',
                'created_at' => now(),
            ],
            [
                'medication_id' => 6,
                'name' => 'Rivaroxaban',
                'category' => 'Bloedverdunner',
                'created_at' => now(),
            ],
        ]);
    }
}
