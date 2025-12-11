<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FloorSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('floors')->insert([
            [
                'floor_id' => 1,
                'name' => 'Begane grond',
                'description' => 'Gemeenschappelijke ruimtes en activiteitenzaal',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'floor_id' => 2,
                'name' => 'Eerste verdieping',
                'description' => 'Bewonerskamers 101-120',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'floor_id' => 3,
                'name' => 'Tweede verdieping',
                'description' => 'Bewonerskamers 201-220',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
