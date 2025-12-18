<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnnouncementRecipientSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('announcement_recipients')->insert([
            // Announcement 1 - Alle medewerkers
            [
                'recipient_id' => 1,
                'announcement_id' => 1,
                'user_id' => 1,
                'is_read' => true,
                'read_at' => now()->subDays(9),
            ],
            [
                'recipient_id' => 2,
                'announcement_id' => 1,
                'user_id' => 2,
                'is_read' => true,
                'read_at' => now()->subDays(8),
            ],
            [
                'recipient_id' => 3,
                'announcement_id' => 1,
                'user_id' => 3,
                'is_read' => true,
                'read_at' => now()->subDays(7),
            ],
            [
                'recipient_id' => 4,
                'announcement_id' => 1,
                'user_id' => 4,
                'is_read' => false,
                'read_at' => null,
            ],
            // Announcement 2 - Verpleegkundigen
            [
                'recipient_id' => 5,
                'announcement_id' => 2,
                'user_id' => 2,
                'is_read' => true,
                'read_at' => now()->subDays(2),
            ],
            [
                'recipient_id' => 6,
                'announcement_id' => 2,
                'user_id' => 3,
                'is_read' => false,
                'read_at' => null,
            ],
            // Announcement 3 - Eerste verdieping
            [
                'recipient_id' => 7,
                'announcement_id' => 3,
                'user_id' => 2,
                'is_read' => true,
                'read_at' => now()->subHours(20),
            ],
            // Announcement 4 - Alle medewerkers
            [
                'recipient_id' => 8,
                'announcement_id' => 4,
                'user_id' => 1,
                'is_read' => false,
                'read_at' => null,
            ],
            [
                'recipient_id' => 9,
                'announcement_id' => 4,
                'user_id' => 2,
                'is_read' => false,
                'read_at' => null,
            ],
            [
                'recipient_id' => 10,
                'announcement_id' => 4,
                'user_id' => 3,
                'is_read' => false,
                'read_at' => null,
            ],
            [
                'recipient_id' => 11,
                'announcement_id' => 4,
                'user_id' => 4,
                'is_read' => false,
                'read_at' => null,
            ],
        ]);
    }
}
