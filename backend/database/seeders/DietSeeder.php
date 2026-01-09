<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DietSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('diets')->insert([
            // Diabetisch Dieet (5 bewoners)
            ['diet_id' => 1, 'diet_type' => 'Diabetisch Dieet', 'resident_id' => 1, 'description' => 'Suikerbeperkt dieet, geen snelle koolhydraten', 'preferences' => json_encode(['likes' => ['Volkorenbrood', 'Groenten'], 'dislikes' => ['Witte rijst']]), 'created_at' => now()],
            ['diet_id' => 2, 'diet_type' => 'Diabetisch Dieet', 'resident_id' => 6, 'description' => 'Let op koolhydraten en bloedsuikerspiegel', 'preferences' => null, 'created_at' => now()],
            ['diet_id' => 3, 'diet_type' => 'Diabetisch Dieet', 'resident_id' => 12, 'description' => 'Regelmatige maaltijden, geen toegevoegde suikers', 'preferences' => null, 'created_at' => now()],
            ['diet_id' => 4, 'diet_type' => 'Diabetisch Dieet', 'resident_id' => 18, 'description' => 'Gecontroleerde koolhydraten intake', 'preferences' => null, 'created_at' => now()],
            ['diet_id' => 5, 'diet_type' => 'Diabetisch Dieet', 'resident_id' => 22, 'description' => 'Type 2 diabetes dieet', 'preferences' => null, 'created_at' => now()],

            // Zoutarm Dieet (3 bewoners)
            ['diet_id' => 6, 'diet_type' => 'Zoutarm Dieet', 'resident_id' => 2, 'description' => 'Maximum 6 gram zout per dag', 'preferences' => json_encode(['likes' => ['Verse groenten', 'Fruit'], 'dislikes' => ['Gezouten noten']]), 'created_at' => now()],
            ['diet_id' => 7, 'diet_type' => 'Zoutarm Dieet', 'resident_id' => 14, 'description' => 'Beperkt natrium, geen zout toevoegen', 'preferences' => null, 'created_at' => now()],
            ['diet_id' => 8, 'diet_type' => 'Zoutarm Dieet', 'resident_id' => 20, 'description' => 'Hartfalen dieet, zoutbeperking', 'preferences' => null, 'created_at' => now()],

            // Zachte Voeding (3 bewoners)
            ['diet_id' => 9, 'diet_type' => 'Zachte Voeding', 'resident_id' => 4, 'description' => 'Zacht en gemakkelijk te kauwen voedsel', 'preferences' => json_encode(['likes' => ['Pap', 'Aardappelpuree', 'Soep'], 'dislikes' => ['Harde groenten']]), 'created_at' => now()],
            ['diet_id' => 10, 'diet_type' => 'Zachte Voeding', 'resident_id' => 10, 'description' => 'Gepureerde maaltijden', 'preferences' => null, 'created_at' => now()],
            ['diet_id' => 11, 'diet_type' => 'Zachte Voeding', 'resident_id' => 16, 'description' => 'Fijngemalen voeding, slikproblemen', 'preferences' => null, 'created_at' => now()],

            // Vegetarisch (2 bewoners)
            ['diet_id' => 12, 'diet_type' => 'Vegetarisch', 'resident_id' => 5, 'description' => 'Geen vlees of vis, wel eieren en zuivel', 'preferences' => json_encode(['likes' => ['Tofu', 'Linzen', 'Quinoa'], 'dislikes' => ['Te pittig']]), 'created_at' => now()],
            ['diet_id' => 13, 'diet_type' => 'Vegetarisch', 'resident_id' => 13, 'description' => 'Plant-based dieet met zuivel', 'preferences' => null, 'created_at' => now()],
        ]);
    }
}
