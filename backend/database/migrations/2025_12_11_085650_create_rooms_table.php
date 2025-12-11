<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id('room_id');
            $table->foreignId('floor_id')->constrained('floors', 'floor_id')->onDelete('cascade');
            $table->foreignId('resident_id')->nullable()->constrained('residents', 'resident_id')->onDelete('set null');
            $table->string('room_number');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
