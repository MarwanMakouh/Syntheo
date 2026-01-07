<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAuditLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (!Schema::hasTable('audit_logs')) {
            Schema::create('audit_logs', function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->unsignedBigInteger('user_id')->nullable()->index();
                $table->string('action')->index();
                // store short entity name (e.g. User, Resident) for easier display
                $table->string('auditable_type')->nullable()->index();
                $table->unsignedBigInteger('auditable_id')->nullable()->index();

                // human readable details / message
                $table->text('details')->nullable();

                // also keep structured old/new values for diffs
                $table->json('old_values')->nullable();
                $table->json('new_values')->nullable();

                // timestamp used for display (can differ from created_at)
                $table->timestamp('timestamp')->useCurrent()->index();

                $table->string('ip_address')->nullable();
                $table->text('user_agent')->nullable();
                $table->timestamps();

                $table->index(['auditable_type', 'auditable_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('audit_logs');
    }
}
