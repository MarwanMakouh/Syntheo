<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;

class AddFloor1Residents extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if rooms already exist on floor 1
        $floor1Rooms = Room::where('floor_id', 1)->get();

        if ($floor1Rooms->count() == 0) {
            // Create new rooms on floor 1
            Room::create([
                'room_number' => '001',
                'floor_id' => 1,
                'resident_id' => 5,
            ]);

            Room::create([
                'room_number' => '002',
                'floor_id' => 1,
                'resident_id' => 6,
            ]);

            $this->command->info('Created 2 rooms on floor 1 and linked residents 5 and 6');
        } else {
            // Update existing rooms
            $availableRooms = Room::where('floor_id', 1)
                ->whereNull('resident_id')
                ->orWhere('floor_id', 1)
                ->limit(2)
                ->get();

            if ($availableRooms->count() > 0) {
                $availableRooms[0]->update(['resident_id' => 5]);
                $this->command->info('Linked resident 5 to room ' . $availableRooms[0]->room_number);
            }

            if ($availableRooms->count() > 1) {
                $availableRooms[1]->update(['resident_id' => 6]);
                $this->command->info('Linked resident 6 to room ' . $availableRooms[1]->room_number);
            }
        }
    }
}
