<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AuditLogSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('audit_logs')->insert([
            [
                'log_id' => 1,
                'user_id' => 2,
                'entity_type' => 'Resident',
                'entity_id' => 1,
                'action' => 'update',
                'details' => json_encode([
                    'field' => 'room_number',
                    'old_value' => '100',
                    'new_value' => '101',
                ]),
                'timestamp' => now()->subDays(5),
            ],
            [
                'log_id' => 2,
                'user_id' => 4,
                'entity_type' => 'Medication',
                'entity_id' => 1,
                'action' => 'create',
                'details' => json_encode([
                    'medication_name' => 'Metformine',
                    'resident_id' => 1,
                ]),
                'timestamp' => now()->subMonths(3),
            ],
            [
                'log_id' => 3,
                'user_id' => 2,
                'entity_type' => 'Note',
                'entity_id' => 1,
                'action' => 'create',
                'details' => json_encode([
                    'category' => 'Medisch',
                    'urgency' => 'Hoog',
                ]),
                'timestamp' => now()->subDays(2),
            ],
            [
                'log_id' => 4,
                'user_id' => 3,
                'entity_type' => 'MedicationRound',
                'entity_id' => 3,
                'action' => 'update',
                'details' => json_encode([
                    'status' => 'Gemist',
                    'reason' => 'Bewoner sliep',
                ]),
                'timestamp' => now()->subHours(12),
            ],
            [
                'log_id' => 5,
                'user_id' => 1,
                'entity_type' => 'User',
                'entity_id' => 2,
                'action' => 'update',
                'details' => json_encode([
                    'field' => 'floor_id',
                    'old_value' => 1,
                    'new_value' => 2,
                ]),
                'timestamp' => now()->subWeeks(2),
            ],
        ]);
    }
}
