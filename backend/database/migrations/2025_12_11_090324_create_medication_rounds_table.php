<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medication_rounds', function (Blueprint $table) {
            $table->id('round_id');
            $table->foreignId('schedule_id')->constrained('res_schedule', 'schedule_id')->onDelete('cascade');
            $table->foreignId('res_medication_id')->constrained('res_medication', 'res_medication_id')->onDelete('cascade');
            $table->foreignId('resident_id')->constrained('residents', 'resident_id')->onDelete('cascade');
            $table->string('status');
            $table->text('notes')->nullable();
            $table->foreignId('given_by')->nullable()->constrained('users', 'user_id')->onDelete('set null');
            $table->timestamp('given_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medication_rounds');
    }
};
