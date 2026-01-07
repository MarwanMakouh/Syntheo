<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AuditLog;
use Carbon\Carbon;

class AuditLogSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $sample = [
            ['timestamp' => $now->copy()->subHours(2), 'user_id' => 1, 'action' => 'updated', 'auditable_type' => 'Resident', 'auditable_id' => 101, 'details' => ['message' => 'Dieet aangepast: Jan Janssen']],
            ['timestamp' => $now->copy()->subHours(4), 'user_id' => 2, 'action' => 'approved', 'auditable_type' => 'ChangeRequest', 'auditable_id' => 201, 'details' => ['message' => 'Medicatie wijziging: Marie Smit']],
            ['timestamp' => $now->copy()->subHours(7), 'user_id' => 3, 'action' => 'created', 'auditable_type' => 'Note', 'auditable_id' => 301, 'details' => ['message' => 'Nieuwe notitie voor Klaas de Vries']],
            ['timestamp' => $now->copy()->subHours(9), 'user_id' => 4, 'action' => 'updated', 'auditable_type' => 'Medication', 'auditable_id' => 401, 'details' => ['message' => 'Dosering aangepast: Anna Bakker']],
            ['timestamp' => $now->copy()->subDay()->subHour(1), 'user_id' => 5, 'action' => 'created', 'auditable_type' => 'Alert', 'auditable_id' => 501, 'details' => ['message' => 'Nieuwe melding aangemaakt voor Piet de Groot']],
            ['timestamp' => $now->copy()->subDays(2), 'user_id' => 6, 'action' => 'rejected', 'auditable_type' => 'ChangeRequest', 'auditable_id' => 202, 'details' => ['message' => 'Dieet wijziging afgewezen: Jan Pieters']],
            ['timestamp' => $now->copy()->subDays(3), 'user_id' => 2, 'action' => 'created', 'auditable_type' => 'User', 'auditable_id' => 601, 'details' => ['message' => 'Nieuwe verpleegkundige toegevoegd: Lisa de Jong']],
            ['timestamp' => $now->copy()->subDays(4), 'user_id' => 1, 'action' => 'updated', 'auditable_type' => 'Resident', 'auditable_id' => 102, 'details' => ['message' => 'Allergieën bijgewerkt: Klaas de Vries']],
            ['timestamp' => $now->copy()->subDays(5), 'user_id' => 4, 'action' => 'deleted', 'auditable_type' => 'Note', 'auditable_id' => 302, 'details' => ['message' => 'Oude notitie verwijderd voor Marie Smit']],
            ['timestamp' => $now->copy()->subDays(6), 'user_id' => 3, 'action' => 'approved', 'auditable_type' => 'ChangeRequest', 'auditable_id' => 203, 'details' => ['message' => 'Dieet wijziging goedgekeurd: Anna Bakker']],
            ['timestamp' => $now->copy()->subDays(7), 'user_id' => 5, 'action' => 'updated', 'auditable_type' => 'Medication', 'auditable_id' => 402, 'details' => ['message' => 'Medicatieschema bijgewerkt: Jan Janssen']],
            ['timestamp' => $now->copy()->subDays(8), 'user_id' => 6, 'action' => 'created', 'auditable_type' => 'Resident', 'auditable_id' => 103, 'details' => ['message' => 'Nieuwe bewoner geregistreerd: Peter van Dam']],
        ];

        // pick a fallback existing user if seed data references non-existent users
        $fallbackUser = \Illuminate\Support\Facades\DB::table('users')->value('user_id');

        foreach ($sample as $row) {
            // ensure referenced user exists, otherwise use fallback
            $userId = $row['user_id'];
            if (!\Illuminate\Support\Facades\DB::table('users')->where('user_id', $userId)->exists()) {
                $userId = $fallbackUser;
            }
            // Insert using columns that exist so seeder works on both old/new schemas
            $data = [];
            if (\Illuminate\Support\Facades\Schema::hasColumn('audit_logs', 'user_id')) {
                $data['user_id'] = $row['user_id'];
            }
            if (\Illuminate\Support\Facades\Schema::hasColumn('audit_logs', 'action')) {
                $data['action'] = $row['action'];
            }
            if (\Illuminate\Support\Facades\Schema::hasColumn('audit_logs', 'auditable_type')) {
                $data['auditable_type'] = $row['auditable_type'];
            } elseif (\Illuminate\Support\Facades\Schema::hasColumn('audit_logs', 'entity_type')) {
                $data['entity_type'] = $row['auditable_type'];
            }
            if (\Illuminate\Support\Facades\Schema::hasColumn('audit_logs', 'auditable_id')) {
                $data['auditable_id'] = $row['auditable_id'];
            } elseif (\Illuminate\Support\Facades\Schema::hasColumn('audit_logs', 'entity_id')) {
                $data['entity_id'] = $row['auditable_id'];
            }
            if (\Illuminate\Support\Facades\Schema::hasColumn('audit_logs', 'details')) {
                $data['details'] = is_array($row['details']) ? json_encode($row['details'], JSON_UNESCAPED_UNICODE) : $row['details'];
            }
            if (\Illuminate\Support\Facades\Schema::hasColumn('audit_logs', 'old_values')) {
                $data['old_values'] = null;
            }
            if (\Illuminate\Support\Facades\Schema::hasColumn('audit_logs', 'new_values')) {
                $data['new_values'] = null;
            }
            if (\Illuminate\Support\Facades\Schema::hasColumn('audit_logs', 'timestamp')) {
                // Store timestamp with zeroed seconds so frontend can show only Y-m-d H:i
                $ts = $row['timestamp'];
                if ($ts instanceof \DateTimeInterface) {
                    $data['timestamp'] = $ts->format('Y-m-d H:i:00');
                } else {
                    $data['timestamp'] = $ts;
                }
            }
            if (\Illuminate\Support\Facades\Schema::hasColumn('audit_logs', 'ip_address')) {
                $data['ip_address'] = '127.0.0.1';
            }
            if (\Illuminate\Support\Facades\Schema::hasColumn('audit_logs', 'user_agent')) {
                $data['user_agent'] = 'Seeder';
            }

            // ensure user_id key uses existing user id (and only include if column exists)
            if (\Illuminate\Support\Facades\Schema::hasColumn('audit_logs', 'user_id')) {
                $data['user_id'] = $userId;
            }

            // Use DB insert to avoid primaryKey/auto-increment differences
            \Illuminate\Support\Facades\DB::table('audit_logs')->insert($data);
        }
    }
}
