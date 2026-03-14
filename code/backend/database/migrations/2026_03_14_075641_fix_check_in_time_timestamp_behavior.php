<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Many MySQL versions automatically add "DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        // to the first TIMESTAMP column in a table (check_in_time).
        // We explicitly change it to avoid this behavior.
        
        // Using raw SQL is often more reliable for this specific MySQL quirk 
        // across different Laravel versions and DB drivers.
        DB::statement("ALTER TABLE transactions MODIFY COLUMN check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No easy way to guess the 'original' broken behavior for everyone, 
        // but typically it wouldn't be reverted unless the whole table is dropped.
    }
};
