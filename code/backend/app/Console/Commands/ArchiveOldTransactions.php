<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Transaction;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ArchiveOldTransactions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:archive-old-transactions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Archives transactions older than 1 year to a JSON file to prevent database bloating over time.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $oneYearAgo = Carbon::now()->subYear();
        
        // Grab records older than a year ensuring they are completed
        $oldTransactions = Transaction::where('status', 'completed')
            ->where('check_out_time', '<', $oneYearAgo)
            ->get();

        if ($oldTransactions->isEmpty()) {
            $this->info('No old transactions left to archive.');
            return 0;
        }

        // Store them in the filesystem json archive
        $filename = 'archives/transactions_archive_' . now()->format('Y_m_d_H_i_s') . '.json';
        Storage::put($filename, $oldTransactions->toJson());

        $count = $oldTransactions->count();
        
        // Delete records from database to optimize query performance natively 
        Transaction::where('status', 'completed')
            ->where('check_out_time', '<', $oneYearAgo)
            ->delete();

        $this->info("Successfully archived and removed {$count} old transactions.");
        return 0;
    }
}
