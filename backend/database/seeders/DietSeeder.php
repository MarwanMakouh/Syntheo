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
                'description' => 'Suikerarm dieet, max 150g koolhydraten per dag',
                'created_at' => now(),
            ],
            [
                'diet_id' => 2,
                'diet_type' => 'Zoutarm',
                'resident_id' => 2,
                'description' => 'Max 2g natrium per dag, hartproblemen',
                'created_at' => now(),
            ],
            [
                'diet_id' => 3,
                'diet_type' => 'Lactosevrij',
                'resident_id' => 3,
                'description' => 'Geen zuivelproducten met lactose',
                'created_at' => now(),
            ],
            [
                'diet_id' => 4,
                'diet_type' => 'Fijngemalen',
                'resident_id' => 4,
                'description' => 'Alle voeding moet gepureerd worden, slikproblemen',
                'created_at' => now(),
            ],
        ]);
    }
}
