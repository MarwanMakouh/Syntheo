<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResidentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('residents')->insert([
            [
                'resident_id' => 1,
                'name' => 'Gerda van der Berg',
                'date_of_birth' => '1945-03-12',
                'photo_url' => 'https://i.pravatar.cc/150?img=1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 2,
                'name' => 'Henk Bakker',
                'date_of_birth' => '1938-07-22',
                'photo_url' => 'https://i.pravatar.cc/150?img=2',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 3,
                'name' => 'Anna de Jong',
                'date_of_birth' => '1942-11-05',
                'photo_url' => 'https://i.pravatar.cc/150?img=3',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 4,
                'name' => 'Willem Jansen',
                'date_of_birth' => '1940-05-18',
                'photo_url' => 'https://i.pravatar.cc/150?img=4',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 5,
                'name' => 'Maria Visser',
                'date_of_birth' => '1948-09-30',
                'photo_url' => 'https://i.pravatar.cc/150?img=5',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 6,
                'name' => 'Piet Mulder',
                'date_of_birth' => '1936-02-14',
                'photo_url' => 'https://i.pravatar.cc/150?img=6',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
