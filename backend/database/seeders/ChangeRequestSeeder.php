<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ChangeRequestSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('change_requests')->insert([
            [
                'request_id' => 1,
                'resident_id' => 1,
                'requester_id' => 2,
                'reviewer_id' => 4,
                'urgency' => 'Hoog',
                'status' => 'Goedgekeurd',
                'created_at' => now()->subDays(2),
                'reviewed_at' => now()->subDays(1),
            ],
            [
                'request_id' => 2,
                'resident_id' => 2,
                'requester_id' => 3,
                'reviewer_id' => null,
                'urgency' => 'Gemiddeld',
                'status' => 'In afwachting',
                'created_at' => now()->subHours(5),
                'reviewed_at' => null,
            ],
            [
                'request_id' => 3,
                'resident_id' => 3,
                'requester_id' => 2,
                'reviewer_id' => 4,
                'urgency' => 'Laag',
                'status' => 'Afgewezen',
                'created_at' => now()->subDays(3),
                'reviewed_at' => now()->subDays(2),
            ],
        ]);
    }
}
