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
                'name' => 'Jan Pieters',
                'date_of_birth' => '1945-03-12',
                'photo_url' => 'https://i.pravatar.cc/150?img=1',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 2,
                'name' => 'Anna Van Berg',
                'date_of_birth' => '1938-07-22',
                'photo_url' => 'https://i.pravatar.cc/150?img=2',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 3,
                'name' => 'Els De Vries',
                'date_of_birth' => '1942-11-05',
                'photo_url' => 'https://i.pravatar.cc/150?img=3',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 4,
                'name' => 'Gert Maes',
                'date_of_birth' => '1940-05-18',
                'photo_url' => 'https://i.pravatar.cc/150?img=4',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 5,
                'name' => 'Johan Willems',
                'date_of_birth' => '1948-09-30',
                'photo_url' => 'https://i.pravatar.cc/150?img=5',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 6,
                'name' => 'Martine Goossens',
                'date_of_birth' => '1936-02-14',
                'photo_url' => 'https://i.pravatar.cc/150?img=6',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 7,
                'name' => 'Simone Wouters',
                'date_of_birth' => '1944-08-20',
                'photo_url' => 'https://i.pravatar.cc/150?img=7',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 8,
                'name' => 'Karel Janssens',
                'date_of_birth' => '1939-12-03',
                'photo_url' => 'https://i.pravatar.cc/150?img=8',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 9,
                'name' => 'Hilde Peeters',
                'date_of_birth' => '1947-06-15',
                'photo_url' => 'https://i.pravatar.cc/150?img=9',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 10,
                'name' => 'Paul Vermeulen',
                'date_of_birth' => '1941-04-28',
                'photo_url' => 'https://i.pravatar.cc/150?img=10',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
