<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Floor;

class BackfillUserFloorsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Assign a floor to existing users with nurse roles who have no floor set.
     */
    public function run()
    {
        $floor = Floor::first();

        if (! $floor) {
            $floor = Floor::create([
                'name' => 'Algemeen',
                'description' => 'Automatisch aangemaakte verdieping'
            ]);
            $this->command->info('Gemaakt standaardverdieping: ' . $floor->name);
        }

        $roles = ['Verpleegster', 'Hoofdverpleegster'];

        $affected = User::whereIn('role', $roles)
            ->whereNull('floor_id')
            ->update(['floor_id' => $floor->floor_id]);

        $this->command->info("Gebruikers bijgewerkt: {$affected}");
    }
}
