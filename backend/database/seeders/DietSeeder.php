<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DietSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('diets')->insert([
            [
                'diet_id' => 1,
                'diet_type' => 'Diabetisch',
                'resident_id' => 1,
                'description' => 'Suikerbeperkt dieet, geen snelle koolhydraten',
                'preferences' => null,
                'created_at' => now(),
            ],
            [
                'diet_id' => 2,
                'diet_type' => 'Zoutarm',
                'resident_id' => 2,
                'description' => 'Maximum 6 gram zout per dag',
                'preferences' => null,
                'created_at' => now(),
            ],
            [
                'diet_id' => 3,
                'diet_type' => 'Lactosevrij',
                'resident_id' => 3,
                'description' => 'Geen zuivelproducten met lactose',
                'preferences' => json_encode([
                    'likes' => ['Pap', 'Aardappelpuree'],
                    'dislikes' => ['Rauwe groenten']
                ]),
                'created_at' => now(),
            ],
            [
                'diet_id' => 4,
                'diet_type' => 'Zachte voeding',
                'resident_id' => 3,
                'description' => 'Zacht en gemakkelijk te kauwen voedsel',
                'preferences' => null,
                'created_at' => now(),
            ],
            [
                'diet_id' => 5,
                'diet_type' => 'Glutenvrij',
                'resident_id' => 5,
                'description' => 'Geen producten met gluten',
                'preferences' => null,
                'created_at' => now(),
            ],
        ]);
    }
}
