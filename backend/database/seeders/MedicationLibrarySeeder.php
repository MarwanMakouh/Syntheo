<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MedicationLibrarySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('medication_library')->insert([
            // Cardiovasculair
            ['medication_id' => 1, 'name' => 'Metoprolol', 'category' => 'Cardiovasculair', 'created_at' => now()],
            ['medication_id' => 2, 'name' => 'Ramipril', 'category' => 'Cardiovasculair', 'created_at' => now()],
            ['medication_id' => 3, 'name' => 'Bisoprolol', 'category' => 'Cardiovasculair', 'created_at' => now()],
            ['medication_id' => 4, 'name' => 'Rivaroxaban', 'category' => 'Bloedverdunner', 'created_at' => now()],
            ['medication_id' => 5, 'name' => 'Acetylsalicylzuur (Aspirine)', 'category' => 'Bloedverdunner', 'created_at' => now()],

            // Diabetes
            ['medication_id' => 6, 'name' => 'Metformine', 'category' => 'Diabetes', 'created_at' => now()],
            ['medication_id' => 7, 'name' => 'Gliclazide', 'category' => 'Diabetes', 'created_at' => now()],
            ['medication_id' => 8, 'name' => 'Insuline Glargine', 'category' => 'Diabetes', 'created_at' => now()],

            // Cholesterol
            ['medication_id' => 9, 'name' => 'Simvastatine', 'category' => 'Cholesterol', 'created_at' => now()],
            ['medication_id' => 10, 'name' => 'Atorvastatine', 'category' => 'Cholesterol', 'created_at' => now()],

            // Maag/darm
            ['medication_id' => 11, 'name' => 'Omeprazol', 'category' => 'Maagzuurremmer', 'created_at' => now()],
            ['medication_id' => 12, 'name' => 'Pantoprazol', 'category' => 'Maagzuurremmer', 'created_at' => now()],
            ['medication_id' => 13, 'name' => 'Macrogol (Movicolon)', 'category' => 'Laxeermiddel', 'created_at' => now()],

            // Pijnstillers
            ['medication_id' => 14, 'name' => 'Paracetamol', 'category' => 'Pijnstiller', 'created_at' => now()],
            ['medication_id' => 15, 'name' => 'Tramadol', 'category' => 'Pijnstiller', 'created_at' => now()],
            ['medication_id' => 16, 'name' => 'Diclofenac', 'category' => 'Pijnstiller/NSAID', 'created_at' => now()],

            // Psychofarmatica
            ['medication_id' => 17, 'name' => 'Lorazepam', 'category' => 'Anxiolyticum', 'created_at' => now()],
            ['medication_id' => 18, 'name' => 'Mirtazapine', 'category' => 'Antidepressivum', 'created_at' => now()],
            ['medication_id' => 19, 'name' => 'Quetiapine', 'category' => 'Antipsychoticum', 'created_at' => now()],
            ['medication_id' => 20, 'name' => 'Temazepam', 'category' => 'Slaapmiddel', 'created_at' => now()],

            // Dementie
            ['medication_id' => 21, 'name' => 'Donepezil', 'category' => 'Dementie', 'created_at' => now()],
            ['medication_id' => 22, 'name' => 'Memantine', 'category' => 'Dementie', 'created_at' => now()],

            // Diuretica
            ['medication_id' => 23, 'name' => 'Furosemide', 'category' => 'Diureticum', 'created_at' => now()],
            ['medication_id' => 24, 'name' => 'Hydrochloorthiazide', 'category' => 'Diureticum', 'created_at' => now()],

            // Overig
            ['medication_id' => 25, 'name' => 'Levothyroxine', 'category' => 'Schildklier', 'created_at' => now()],
            ['medication_id' => 26, 'name' => 'Calcium/Vitamine D', 'category' => 'Supplement', 'created_at' => now()],
            ['medication_id' => 27, 'name' => 'Salbutamol', 'category' => 'Luchtwegen', 'created_at' => now()],
            ['medication_id' => 28, 'name' => 'Tiotropium', 'category' => 'Luchtwegen', 'created_at' => now()],
        ]);
    }
}
