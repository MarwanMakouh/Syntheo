<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('change_requests', function (Blueprint $table) {
            $table->id('request_id');
            $table->foreignId('resident_id')->constrained('residents', 'resident_id')->onDelete('cascade');
            $table->foreignId('requester_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->foreignId('reviewer_id')->nullable()->constrained('users', 'user_id')->onDelete('set null');
            $table->string('urgency');
            $table->string('status');
            $table->timestamp('created_at');
            $table->timestamp('reviewed_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('change_requests');
    }
};
