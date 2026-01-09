<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AllergySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('allergies')->insert([
            // Half van de bewoners heeft allergieën (13 bewoners)
            ['allergy_id' => 1, 'resident_id' => 1, 'symptom' => 'Penicilline', 'severity' => 'Ernst', 'notes' => 'Anafylaxie risico', 'created_at' => now()],
            ['allergy_id' => 2, 'resident_id' => 3, 'symptom' => 'Pinda\'s', 'severity' => 'Ernst', 'notes' => 'Anafylactische reactie', 'created_at' => now()],
            ['allergy_id' => 3, 'resident_id' => 5, 'symptom' => 'Lactose', 'severity' => 'Matig', 'notes' => 'Spijsverteringsproblemen', 'created_at' => now()],
            ['allergy_id' => 4, 'resident_id' => 7, 'symptom' => 'Sulfa medicijnen', 'severity' => 'Ernst', 'notes' => 'Huiduitslag en zwelling', 'created_at' => now()],
            ['allergy_id' => 5, 'resident_id' => 9, 'symptom' => 'Schaaldieren', 'severity' => 'Ernst', 'notes' => 'Hevige allergische reactie', 'created_at' => now()],
            ['allergy_id' => 6, 'resident_id' => 11, 'symptom' => 'Noten', 'severity' => 'Matig', 'notes' => 'Jeuk en huiduitslag', 'created_at' => now()],
            ['allergy_id' => 7, 'resident_id' => 13, 'symptom' => 'Gluten', 'severity' => 'Matig', 'notes' => 'Coeliakie', 'created_at' => now()],
            ['allergy_id' => 8, 'resident_id' => 15, 'symptom' => 'Ibuprofen', 'severity' => 'Ernst', 'notes' => 'Maagbloedingen', 'created_at' => now()],
            ['allergy_id' => 9, 'resident_id' => 17, 'symptom' => 'Eieren', 'severity' => 'Licht', 'notes' => 'Huidirritatie', 'created_at' => now()],
            ['allergy_id' => 10, 'resident_id' => 19, 'symptom' => 'Codeine', 'severity' => 'Matig', 'notes' => 'Misselijkheid en braken', 'created_at' => now()],
            ['allergy_id' => 11, 'resident_id' => 21, 'symptom' => 'Soja', 'severity' => 'Licht', 'notes' => 'Lichte huidreactie', 'created_at' => now()],
            ['allergy_id' => 12, 'resident_id' => 23, 'symptom' => 'Aspirin', 'severity' => 'Ernst', 'notes' => 'Astma aanvallen', 'created_at' => now()],
            ['allergy_id' => 13, 'resident_id' => 25, 'symptom' => 'Latex', 'severity' => 'Matig', 'notes' => 'Contactallergie', 'created_at' => now()],
        ]);
    }
}
