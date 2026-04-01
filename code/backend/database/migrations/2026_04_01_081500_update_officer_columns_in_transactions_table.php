<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Rename existing officer_id to entry_officer_id
            $table->renameColumn('officer_id', 'entry_officer_id');
            
            // Add exit_officer_id
            $table->foreignId('exit_officer_id')->nullable()->constrained('users')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['exit_officer_id']);
            $table->dropColumn('exit_officer_id');
            $table->renameColumn('entry_officer_id', 'officer_id');
        });
    }
};
