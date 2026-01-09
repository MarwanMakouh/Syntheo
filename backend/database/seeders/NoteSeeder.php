<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NoteSeeder extends Seeder
{
    public function run(): void
    {
        $notes = [];
        $id = 1;
        $authors = [3, 4, 5, 6, 7]; // Nurses
        $openNoteResidents = [4, 7, 10, 12, 15, 18, 20, 23]; // 1/3 of residents have open notes

        // Resolved notes content (general observations)
        $resolvedNotes = [
            ['general', 'low', 'Bewoner at goed tijdens het avondeten'],
            ['social', 'low', 'Familie op bezoek geweest, bewoner was blij'],
            ['behavior', 'low', 'Bewoner nam deel aan activiteiten'],
            ['health', 'low', 'Bloeddruk gemeten, waarden normaal'],
            ['general', 'low', 'Nachtrust was goed, sliep rustig'],
            ['health', 'low', 'Geen bijzonderheden tijdens verzorging'],
            ['social', 'low', 'Bewoner keek tv in gemeenschappelijke ruimte'],
            ['general', 'low', 'Ontbijt volledig opgeeten'],
            ['behavior', 'low', 'Bewoner was vandaag goed gehumeurd'],
            ['health', 'low', 'Wond verbonden, ziet er goed uit'],
        ];

        // Open notes (mix of general and some serious ones)
        $openNotes = [
            ['general', 'low', 'Bewoner klaagt over slecht slapen'],
            ['health', 'medium', 'Bewoner heeft lichte koorts (37.8°C), in de gaten houden'],
            ['medication', 'medium', 'Medicatie niet ingenomen, bewoner weigerde'],
            ['general', 'low', 'Vraagt om extra deken'],
            ['health', 'high', 'Bewoner gevallen, geen verwondingen maar wel pijn'],
            ['behavior', 'medium', 'Bewoner is verward en onrustig'],
            ['health', 'high', 'Bloedsuiker te laag gemeten (3.2), snel suiker gegeven'],
            ['general', 'medium', 'Eet slecht, nauwelijks lunch aangeraakt'],
            ['health', 'medium', 'Kortademig, zuurstof toegediend'],
            ['medication', 'high', 'Medicatie braakte uit, arts contacteren'],
        ];

        // Generate 2-3 resolved notes per resident
        foreach (range(1, 25) as $resId) {
            $numNotes = rand(2, 3);
            for ($i = 0; $i < $numNotes; $i++) {
                $note = $resolvedNotes[array_rand($resolvedNotes)];
                $daysAgo = rand(3, 14);
                $notes[] = [
                    'note_id' => $id++,
                    'resident_id' => $resId,
                    'author_id' => $authors[array_rand($authors)],
                    'category' => $note[0],
                    'urgency' => $note[1],
                    'content' => $note[2],
                    'is_resolved' => true,
                    'created_at' => now()->subDays($daysAgo)->subHours(rand(8, 18)),
                    'resolved_at' => now()->subDays($daysAgo - 1)->subHours(rand(8, 18)),
                    'resolved_by' => $authors[array_rand($authors)],
                ];
            }
        }

        // Generate open notes for 1/3 of residents
        foreach ($openNoteResidents as $resId) {
            $numOpen = rand(1, 3);
            for ($i = 0; $i < $numOpen; $i++) {
                $note = $openNotes[array_rand($openNotes)];
                $hoursAgo = rand(2, 48);
                $notes[] = [
                    'note_id' => $id++,
                    'resident_id' => $resId,
                    'author_id' => $authors[array_rand($authors)],
                    'category' => $note[0],
                    'urgency' => $note[1],
                    'content' => $note[2],
                    'is_resolved' => false,
                    'created_at' => now()->subHours($hoursAgo),
                    'resolved_at' => null,
                    'resolved_by' => null,
                ];
            }
        }

        DB::table('notes')->insert($notes);
    }
}
