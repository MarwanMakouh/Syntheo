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
            RoomSeeder::class,  // Toegevoegd - moet NA residents
            AddFloor1Residents::class,  // Link bewoners 5 en 6 aan verdieping 1
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
