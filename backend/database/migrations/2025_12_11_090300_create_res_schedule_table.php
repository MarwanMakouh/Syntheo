<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('res_schedule', function (Blueprint $table) {
            $table->id('schedule_id');
            $table->foreignId('res_medication_id')->constrained('res_medication', 'res_medication_id')->onDelete('cascade');
            $table->string('dosage');
            $table->text('instructions')->nullable();
            $table->string('time_of_day'); // Changed from time() to string() - stores 'Ochtend', 'Middag', 'Avond', 'Nacht'
            $table->string('day_of_week')->nullable(); // Added nullable() - null means daily
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('res_schedule');
    }
};
