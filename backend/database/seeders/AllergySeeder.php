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
                'symptom' => 'Gluten',
                'severity' => 'Ernst',
                'notes' => 'Anafylactische shock',
                'created_at' => now(),
            ],
            [
                'allergy_id' => 2,
                'resident_id' => 2,
                'symptom' => 'Lactose',
                'severity' => 'Matig',
                'notes' => 'Spijsverteringsproblemen',
                'created_at' => now(),
            ],
            [
                'allergy_id' => 3,
                'resident_id' => 3,
                'symptom' => 'Pinda\'s',
                'severity' => 'Ernst',
                'notes' => 'Anafylaxie risico',
                'created_at' => now(),
            ],
            [
                'allergy_id' => 4,
                'resident_id' => 5,
                'symptom' => 'Schaaldieren',
                'severity' => 'Ernst',
                'notes' => 'Hevige allergie',
                'created_at' => now(),
            ],
            [
                'allergy_id' => 5,
                'resident_id' => 6,
                'symptom' => 'Soja',
                'severity' => 'Matig',
                'notes' => 'Huiduitslag',
                'created_at' => now(),
            ],
            [
                'allergy_id' => 6,
                'resident_id' => 7,
                'symptom' => 'Eieren',
                'severity' => 'Matig',
                'notes' => 'Huidirritatie',
                'created_at' => now(),
            ],
            // Bewoners 4, 8, 9, 10 hebben geen allergieën
        ]);
    }
}
