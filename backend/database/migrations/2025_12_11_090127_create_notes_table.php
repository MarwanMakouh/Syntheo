<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->id('note_id');
            $table->foreignId('resident_id')->constrained('residents', 'resident_id')->onDelete('cascade');
            $table->foreignId('author_id')->constrained('users', 'user_id')->onDelete('cascade');
            $table->string('category');
            $table->string('urgency');
            $table->text('content');
            $table->boolean('is_resolved')->default(false);
            $table->timestamp('created_at');
            $table->timestamp('resolved_at')->nullable();
            $table->foreignId('resolved_by')->nullable()->constrained('users', 'user_id')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
