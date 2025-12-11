<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id('contact_id');
            $table->foreignId('resident_id')->constrained('residents', 'resident_id')->onDelete('cascade');
            $table->string('name');
            $table->string('relation');
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->boolean('is_primary')->default(false);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
