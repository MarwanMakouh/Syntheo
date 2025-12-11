<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            FloorSeeder::class,
            UserSeeder::class,
            ResidentSeeder::class,
            ContactSeeder::class,
            AllergySeeder::class,
            DietSeeder::class,
            NoteSeeder::class,
            MedicationLibrarySeeder::class,
            ResMedicationSeeder::class,
            ResScheduleSeeder::class,
            MedicationRoundSeeder::class,
            ChangeRequestSeeder::class,
            ChangeFieldSeeder::class,
            AuditLogSeeder::class,
            AnnouncementSeeder::class,
            AnnouncementRecipientSeeder::class,
        ]);
    }
}
