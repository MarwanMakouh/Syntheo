<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('diets', function (Blueprint $table) {
            $table->id('diet_id');
            $table->string('diet_type');
            $table->foreignId('resident_id')->constrained('residents', 'resident_id')->onDelete('cascade');
            $table->text('description')->nullable();
            $table->jsonb('preferences')->nullable(); // Added preferences field for likes/dislikes
            $table->timestamp('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diets');
    }
};
