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
        Schema::table('parking_rates', function (Blueprint $table) {
            $table->integer('grace_period_minutes')->default(0)->after('vehicle_type');
            $table->integer('initial_rate')->default(0)->after('grace_period_minutes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('parking_rates', function (Blueprint $table) {
            $table->dropColumn(['grace_period_minutes', 'initial_rate']);
        });
    }
};
