<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DietSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('diets')->insert([
            // Diabetisch Dieet (3 bewoners)
            [
                'diet_id' => 1,
                'diet_type' => 'Diabetisch Dieet',
                'resident_id' => 1,
                'description' => 'Suikerbeperkt dieet, geen snelle koolhydraten',
                'preferences' => json_encode([
                    'likes' => ['Volkorenbrood', 'Groenten'],
                    'dislikes' => ['Witte rijst']
                ]),
                'created_at' => now(),
            ],
            [
                'diet_id' => 2,
                'diet_type' => 'Diabetisch Dieet',
                'resident_id' => 4,
                'description' => 'Let op koolhydraten en bloedsuikerspiegel',
                'preferences' => null,
                'created_at' => now(),
            ],
            [
                'diet_id' => 3,
                'diet_type' => 'Diabetisch Dieet',
                'resident_id' => 8,
                'description' => 'Regelmatige maaltijden, geen toegevoegde suikers',
                'preferences' => null,
                'created_at' => now(),
            ],

            // Zoutarm Dieet (2 bewoners)
            [
                'diet_id' => 4,
                'diet_type' => 'Zoutarm Dieet',
                'resident_id' => 2,
                'description' => 'Maximum 6 gram zout per dag',
                'preferences' => json_encode([
                    'likes' => ['Verse groenten', 'Fruit'],
                    'dislikes' => ['Gezouten noten']
                ]),
                'created_at' => now(),
            ],
            [
                'diet_id' => 5,
                'diet_type' => 'Zoutarm Dieet',
                'resident_id' => 9,
                'description' => 'Beperkt natrium, geen zout toevoegen',
                'preferences' => null,
                'created_at' => now(),
            ],

            // Vegetarisch (3 bewoners)
            [
                'diet_id' => 6,
                'diet_type' => 'Vegetarisch',
                'resident_id' => 5,
                'description' => 'Geen vlees of vis, wel eieren en zuivel',
                'preferences' => json_encode([
                    'likes' => ['Tofu', 'Linzen', 'Quinoa'],
                    'dislikes' => ['Te pittig']
                ]),
                'created_at' => now(),
            ],
            [
                'diet_id' => 7,
                'diet_type' => 'Vegetarisch',
                'resident_id' => 6,
                'description' => 'Plant-based dieet met zuivel',
                'preferences' => null,
                'created_at' => now(),
            ],
            [
                'diet_id' => 8,
                'diet_type' => 'Vegetarisch',
                'resident_id' => 10,
                'description' => 'Gevarieerd vegetarisch menu',
                'preferences' => null,
                'created_at' => now(),
            ],

            // Zachte Voeding (2 bewoners)
            [
                'diet_id' => 9,
                'diet_type' => 'Zachte Voeding',
                'resident_id' => 3,
                'description' => 'Zacht en gemakkelijk te kauwen voedsel',
                'preferences' => json_encode([
                    'likes' => ['Pap', 'Aardappelpuree', 'Soep'],
                    'dislikes' => ['Harde groenten']
                ]),
                'created_at' => now(),
            ],
            [
                'diet_id' => 10,
                'diet_type' => 'Zachte Voeding',
                'resident_id' => 7,
                'description' => 'Fijngemalen of gemixte consistentie',
                'preferences' => null,
                'created_at' => now(),
            ],
        ]);
    }
}
