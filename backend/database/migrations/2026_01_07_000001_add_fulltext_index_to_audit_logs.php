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
                // PostgreSQL full-text search using GIN index
                DB::statement('CREATE INDEX audit_logs_details_fulltext ON audit_logs USING GIN (to_tsvector(\'english\', COALESCE(details, \'\')))');
            } catch (\Throwable $e) {
                // ignore if index exists or DB doesn't support it
            }
        }
    }

    public function down()
    {
        if (Schema::hasTable('audit_logs')) {
            try {
                DB::statement('DROP INDEX IF EXISTS audit_logs_details_fulltext');
            } catch (\Throwable $e) {
            }
        }
    }
}
