<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NoteSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('notes')->insert([
            [
                'note_id' => 1,
                'resident_id' => 1,
                'author_id' => 2,
                'category' => 'Medisch',
                'urgency' => 'Hoog',
                'content' => 'Bloeddruk verhoogd, 160/95. Dokter gecontacteerd.',
                'is_resolved' => true,
                'created_at' => now()->subDays(2),
                'resolved_at' => now()->subDays(1),
                'resolved_by' => 4,
            ],
            [
                'note_id' => 2,
                'resident_id' => 2,
                'author_id' => 3,
                'category' => 'Gedrag',
                'urgency' => 'Gemiddeld',
                'content' => 'Bewoner is verward en onrustig deze ochtend. Familie is ingelicht.',
                'is_resolved' => false,
                'created_at' => now()->subHours(3),
                'resolved_at' => null,
                'resolved_by' => null,
            ],
            [
                'note_id' => 3,
                'resident_id' => 3,
                'author_id' => 2,
                'category' => 'Vallen',
                'urgency' => 'Hoog',
                'content' => 'Val in badkamer om 14:30. Geen verwondingen. Protocollen gevolgd.',
                'is_resolved' => true,
                'created_at' => now()->subDays(1),
                'resolved_at' => now()->subDays(1),
                'resolved_by' => 4,
            ],
            [
                'note_id' => 4,
                'resident_id' => 1,
                'author_id' => 2,
                'category' => 'Algemeen',
                'urgency' => 'Laag',
                'content' => 'Bewoner heeft goed geslapen en heeft met plezier ontbeten.',
                'is_resolved' => true,
                'created_at' => now(),
                'resolved_at' => now(),
                'resolved_by' => 2,
            ],
        ]);
    }
}
