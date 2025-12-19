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
                'category' => 'health',
                'urgency' => 'high',
                'content' => 'Bewoner heeft koorts, huisarts gecontacteerd',
                'is_resolved' => false,
                'created_at' => now()->subHours(6),
                'resolved_at' => null,
                'resolved_by' => null,
            ],
            [
                'note_id' => 2,
                'resident_id' => 2,
                'author_id' => 3,
                'category' => 'behavior',
                'urgency' => 'low',
                'content' => 'Bewoner was vandaag erg opgewekt tijdens lunch',
                'is_resolved' => true,
                'created_at' => now()->subDays(1)->subHours(12),
                'resolved_at' => now()->subDays(1)->subHours(10),
                'resolved_by' => 2,
            ],
            [
                'note_id' => 3,
                'resident_id' => 3,
                'author_id' => 2,
                'category' => 'general',
                'urgency' => 'high',
                'content' => 'Bewoner gevallen in badkamer, geen verwondingen',
                'is_resolved' => true,
                'created_at' => now()->subDays(2)->subHours(8),
                'resolved_at' => now()->subDays(2)->subHours(7),
                'resolved_by' => 1,
            ],
            [
                'note_id' => 4,
                'resident_id' => 4,
                'author_id' => 4,
                'category' => 'medication',
                'urgency' => 'medium',
                'content' => 'Bewoner weigerde medicatie in te nemen',
                'is_resolved' => false,
                'created_at' => now()->subHours(15),
                'resolved_at' => null,
                'resolved_by' => null,
            ],
            [
                'note_id' => 5,
                'resident_id' => 5,
                'author_id' => 2,
                'category' => 'social',
                'urgency' => 'low',
                'content' => 'Familie heeft gebeld, komt morgen op bezoek',
                'is_resolved' => true,
                'created_at' => now()->subDays(1)->subHours(10),
                'resolved_at' => now()->subHours(14),
                'resolved_by' => 2,
            ],
            [
                'note_id' => 6,
                'resident_id' => 6,
                'author_id' => 3,
                'category' => 'general',
                'urgency' => 'medium',
                'content' => 'Bewoner at slecht tijdens avondeten, houdt in de gaten',
                'is_resolved' => false,
                'created_at' => now()->subHours(5),
                'resolved_at' => null,
                'resolved_by' => null,
            ],
        ]);
    }
}
