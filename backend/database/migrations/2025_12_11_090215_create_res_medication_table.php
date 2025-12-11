<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('res_medication', function (Blueprint $table) {
            $table->id('res_medication_id');
            $table->foreignId('medication_id')->constrained('medication_library', 'medication_id')->onDelete('cascade');
            $table->foreignId('resident_id')->constrained('residents', 'resident_id')->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->date('end_date')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('res_medication');
    }
};
