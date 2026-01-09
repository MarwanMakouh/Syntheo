<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('announcements')->insert([
            // General announcement for everyone
            [
                'announcement_id' => 1,
                'author_id' => 1,
                'title' => 'Wijziging bezoekregeling',
                'message' => 'Vanaf volgende week zijn bezoekuren uitgebreid van 14:00 tot 20:00 uur. Familie en vrienden zijn van harte welkom.',
                'recipient_type' => 'Alle medewerkers',
                'floor_id' => null,
                'created_at' => now()->subDays(2),
            ],
            // Floor-specific announcements
            [
                'announcement_id' => 2,
                'author_id' => 1,
                'title' => 'Onderhoud lift begane grond',
                'message' => 'Donderdag 10:00-12:00 uur wordt onderhoud uitgevoerd aan de lift. Gebruik tijdens deze tijd de trap.',
                'recipient_type' => 'Verdieping specifiek',
                'floor_id' => 1,
                'created_at' => now()->subDays(1),
            ],
            [
                'announcement_id' => 3,
                'author_id' => 2,
                'title' => 'Groepsactiviteit eerste verdieping',
                'message' => 'Vrijdagmiddag om 15:00 uur: muziektherapie in de gemeenschappelijke ruimte. Alle bewoners zijn welkom.',
                'recipient_type' => 'Verdieping specifiek',
                'floor_id' => 2,
                'created_at' => now()->subHours(18),
            ],
            [
                'announcement_id' => 4,
                'author_id' => 2,
                'title' => 'Tuinactiviteit tweede verdieping',
                'message' => 'Woensdag 14:00 uur: wandeling in de tuin voor bewoners tweede verdieping (bij goed weer).',
                'recipient_type' => 'Verdieping specifiek',
                'floor_id' => 3,
                'created_at' => now()->subHours(12),
            ],
            // Staff-specific announcements
            [
                'announcement_id' => 5,
                'author_id' => 1,
                'title' => 'Teamvergadering verpleging',
                'message' => 'Maandag 9:00 uur: maandelijkse teamvergadering. Bespreken nieuwe medicatieprotocollen en lopende zorgplannen.',
                'recipient_type' => 'Verpleegkundigen',
                'floor_id' => null,
                'created_at' => now()->subDays(3),
            ],
            [
                'announcement_id' => 6,
                'author_id' => 8,
                'title' => 'Nieuwe menukaart beschikbaar',
                'message' => 'De zomerkaart is beschikbaar. Aanpassingen voor dieetwensen graag doorgeven voor vrijdag.',
                'recipient_type' => 'Keukenpersoneel',
                'floor_id' => null,
                'created_at' => now()->subDays(5),
            ],
            // General care announcements
            [
                'announcement_id' => 7,
                'author_id' => 1,
                'title' => 'Warmte-alarm protocol',
                'message' => 'Door hoge temperaturen komende dagen: extra aandacht voor hydratatie bewoners. Waterinname monitoren en registreren.',
                'recipient_type' => 'Alle medewerkers',
                'floor_id' => null,
                'created_at' => now()->subHours(6),
            ],
            [
                'announcement_id' => 8,
                'author_id' => 2,
                'title' => 'Nascholing val preventie',
                'message' => 'Dinsdag 13:30 uur: verplichte nascholing valpreventie. Aanmelden bij hoofdverpleging.',
                'recipient_type' => 'Verpleegkundigen',
                'floor_id' => null,
                'created_at' => now()->subDays(7),
            ],
            [
                'announcement_id' => 9,
                'author_id' => 1,
                'title' => 'Familiedag volgende maand',
                'message' => 'Zaterdag 15 juni: jaarlijkse familiedag van 13:00-18:00 uur. Programma volgt binnenkort. Noteer in agenda!',
                'recipient_type' => 'Alle medewerkers',
                'floor_id' => null,
                'created_at' => now()->subDays(10),
            ],
        ]);
    }
}
