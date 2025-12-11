<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AllergySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('allergies')->insert([
            [
                'allergy_id' => 1,
                'resident_id' => 1,
                'symptom' => 'Penicilline',
                'severity' => 'Hoog',
                'created_at' => now(),
            ],
            [
                'allergy_id' => 2,
                'resident_id' => 2,
                'symptom' => 'Noten',
                'severity' => 'Gemiddeld',
                'created_at' => now(),
            ],
            [
                'allergy_id' => 3,
                'resident_id' => 3,
                'symptom' => 'Lactose',
                'severity' => 'Laag',
                'created_at' => now(),
            ],
            [
                'allergy_id' => 4,
                'resident_id' => 4,
                'symptom' => 'Sulfa-antibiotica',
                'severity' => 'Hoog',
                'created_at' => now(),
            ],
        ]);
    }
}
