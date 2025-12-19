<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('allergies', function (Blueprint $table) {
            $table->id('allergy_id');
            $table->foreignId('resident_id')->constrained('residents', 'resident_id')->onDelete('cascade');
            $table->string('symptom');
            $table->string('severity');
            $table->text('notes')->nullable(); // Added notes field for additional allergy information
            $table->timestamp('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('allergies');
    }
};
