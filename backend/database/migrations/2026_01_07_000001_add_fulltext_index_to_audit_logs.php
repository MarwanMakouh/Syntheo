<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddFulltextIndexToAuditLogs extends Migration
{
    public function up()
    {
        if (Schema::hasTable('audit_logs') && Schema::hasColumn('audit_logs', 'details')) {
            try {
                // MySQL fulltext on InnoDB is supported on modern MySQL/MariaDB.
                DB::statement('ALTER TABLE `audit_logs` ADD FULLTEXT INDEX `audit_logs_details_fulltext` (`details`)');
            } catch (\Throwable $e) {
                // ignore if index exists or DB doesn't support fulltext
            }
        }
    }

    public function down()
    {
        if (Schema::hasTable('audit_logs')) {
            try {
                DB::statement('ALTER TABLE `audit_logs` DROP INDEX `audit_logs_details_fulltext`');
            } catch (\Throwable $e) {
            }
        }
    }
}
