<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained('vehicles')->onDelete('cascade');
            $table->foreignId('area_id')->constrained('parking_areas')->onDelete('restrict');
            $table->foreignId('rate_id')->constrained('parking_rates')->onDelete('restrict');
            $table->foreignId('officer_id')->constrained('users')->onDelete('restrict');
            $table->string('ticket_number', 50)->unique();
            $table->timestamp('check_in_time');
            $table->timestamp('check_out_time')->nullable();
            $table->decimal('duration_hours', 10, 2)->nullable();
            $table->integer('total_cost')->nullable();
            $table->string('payment_status', 20)->default('pending');
            $table->enum('status', ['active', 'completed'])->default('active');
            $table->timestamps();
            
            // Indexes untuk performance
            $table->index('status');
            $table->index(['check_in_time', 'check_out_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};