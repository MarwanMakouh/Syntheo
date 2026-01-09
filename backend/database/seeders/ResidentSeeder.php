<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResidentSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('residents')->insert([
            // Floor 1 residents (8 bewoners)
            [
                'resident_id' => 1,
                'name' => 'Maria Janssens',
                'date_of_birth' => '1938-03-15',
                'photo_url' => 'https://i.pravatar.cc/150?img=47',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 2,
                'name' => 'Jozef Peeters',
                'date_of_birth' => '1940-07-22',
                'photo_url' => 'https://i.pravatar.cc/150?img=12',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 3,
                'name' => 'Anna De Smet',
                'date_of_birth' => '1942-11-08',
                'photo_url' => 'https://i.pravatar.cc/150?img=48',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 4,
                'name' => 'Frans Van Damme',
                'date_of_birth' => '1935-05-14',
                'photo_url' => 'https://i.pravatar.cc/150?img=13',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 5,
                'name' => 'Elise Claes',
                'date_of_birth' => '1945-09-30',
                'photo_url' => 'https://i.pravatar.cc/150?img=44',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 6,
                'name' => 'Paul Maes',
                'date_of_birth' => '1937-02-17',
                'photo_url' => 'https://i.pravatar.cc/150?img=15',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 7,
                'name' => 'Rita Vermeulen',
                'date_of_birth' => '1943-08-25',
                'photo_url' => 'https://i.pravatar.cc/150?img=43',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 8,
                'name' => 'Guido Willems',
                'date_of_birth' => '1939-12-03',
                'photo_url' => 'https://i.pravatar.cc/150?img=14',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Floor 2 residents (9 bewoners)
            [
                'resident_id' => 9,
                'name' => 'Margareta Wouters',
                'date_of_birth' => '1941-04-12',
                'photo_url' => 'https://i.pravatar.cc/150?img=49',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 10,
                'name' => 'Herman Goossens',
                'date_of_birth' => '1936-10-28',
                'photo_url' => 'https://i.pravatar.cc/150?img=51',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 11,
                'name' => 'Simone De Vos',
                'date_of_birth' => '1944-06-19',
                'photo_url' => 'https://i.pravatar.cc/150?img=45',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 12,
                'name' => 'Albert Jacobs',
                'date_of_birth' => '1938-01-07',
                'photo_url' => 'https://i.pravatar.cc/150?img=52',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 13,
                'name' => 'Jeanne Van den Berg',
                'date_of_birth' => '1946-11-23',
                'photo_url' => 'https://i.pravatar.cc/150?img=24',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 14,
                'name' => 'Roger Mertens',
                'date_of_birth' => '1940-03-16',
                'photo_url' => 'https://i.pravatar.cc/150?img=53',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 15,
                'name' => 'Christiane Dubois',
                'date_of_birth' => '1942-07-09',
                'photo_url' => 'https://i.pravatar.cc/150?img=26',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 16,
                'name' => 'André Lemmens',
                'date_of_birth' => '1937-09-14',
                'photo_url' => 'https://i.pravatar.cc/150?img=54',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 17,
                'name' => 'Monique Hermans',
                'date_of_birth' => '1945-05-21',
                'photo_url' => 'https://i.pravatar.cc/150?img=27',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Floor 3 residents (8 bewoners)
            [
                'resident_id' => 18,
                'name' => 'Marcel Pauwels',
                'date_of_birth' => '1939-08-05',
                'photo_url' => 'https://i.pravatar.cc/150?img=56',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 19,
                'name' => 'Denise Claessens',
                'date_of_birth' => '1943-12-18',
                'photo_url' => 'https://i.pravatar.cc/150?img=29',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 20,
                'name' => 'Louis De Cock',
                'date_of_birth' => '1936-02-27',
                'photo_url' => 'https://i.pravatar.cc/150?img=57',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 21,
                'name' => 'Yvette Stevens',
                'date_of_birth' => '1941-10-11',
                'photo_url' => 'https://i.pravatar.cc/150?img=31',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 22,
                'name' => 'Robert Michiels',
                'date_of_birth' => '1938-06-04',
                'photo_url' => 'https://i.pravatar.cc/150?img=58',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 23,
                'name' => 'Agnès Lambert',
                'date_of_birth' => '1944-04-29',
                'photo_url' => 'https://i.pravatar.cc/150?img=32',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 24,
                'name' => 'Georges Van Hove',
                'date_of_birth' => '1940-01-15',
                'photo_url' => 'https://i.pravatar.cc/150?img=59',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'resident_id' => 25,
                'name' => 'Thérèse Bogaert',
                'date_of_birth' => '1947-09-08',
                'photo_url' => 'https://i.pravatar.cc/150?img=33',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
