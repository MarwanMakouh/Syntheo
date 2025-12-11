<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('announcements')->insert([
            [
                'announcement_id' => 1,
                'author_id' => 1,
                'title' => 'Vakantieregeling zomerperiode',
                'message' => 'Graag voor 15 juni jullie verlofaanvragen indienen voor de maanden juli en augustus.',
                'recipient_type' => 'Alle medewerkers',
                'floor_id' => null,
                'created_at' => now()->subDays(10),
            ],
            [
                'announcement_id' => 2,
                'author_id' => 4,
                'title' => 'Medicatie protocol update',
                'message' => 'Nieuw protocol voor bloedverdunners is beschikbaar. Verplichte training volgt volgende week.',
                'recipient_type' => 'Verpleegkundigen',
                'floor_id' => null,
                'created_at' => now()->subDays(3),
            ],
            [
                'announcement_id' => 3,
                'author_id' => 1,
                'title' => 'Brandoefening eerste verdieping',
                'message' => 'Donderdag 15:00 uur brandoefening op eerste verdieping. Bewoners zijn ingelicht.',
                'recipient_type' => 'Verdieping specifiek',
                'floor_id' => 2,
                'created_at' => now()->subDays(1),
            ],
            [
                'announcement_id' => 4,
                'author_id' => 1,
                'title' => 'Familiedag aanstaande zondag',
                'message' => 'Aanstaande zondag is de jaarlijkse familiedag. Activiteiten van 14:00 tot 18:00 uur.',
                'recipient_type' => 'Alle medewerkers',
                'floor_id' => null,
                'created_at' => now()->subHours(6),
            ],
        ]);
    }
}
