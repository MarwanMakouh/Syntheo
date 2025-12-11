<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContactSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('contacts')->insert([
            [
                'contact_id' => 1,
                'resident_id' => 1,
                'name' => 'Peter Peeters',
                'relation' => 'Zoon',
                'phone' => '0478123456',
                'email' => 'peter.peeters@email.be',
                'is_primary' => true,
            ],
            [
                'contact_id' => 2,
                'resident_id' => 1,
                'name' => 'Linda Peeters',
                'relation' => 'Dochter',
                'phone' => '0479234567',
                'email' => 'linda.peeters@email.be',
                'is_primary' => false,
            ],
            [
                'contact_id' => 3,
                'resident_id' => 2,
                'name' => 'Marc Willems',
                'relation' => 'Zoon',
                'phone' => '0476345678',
                'email' => 'marc.willems@email.be',
                'is_primary' => true,
            ],
            [
                'contact_id' => 4,
                'resident_id' => 3,
                'name' => 'Sophie Claes',
                'relation' => 'Kleindochter',
                'phone' => '0477456789',
                'email' => 'sophie.claes@email.be',
                'is_primary' => true,
            ],
            [
                'contact_id' => 5,
                'resident_id' => 4,
                'name' => 'Kristien Mertens',
                'relation' => 'Dochter',
                'phone' => '0475567890',
                'email' => 'kristien.mertens@email.be',
                'is_primary' => true,
            ],
        ]);
    }
}
