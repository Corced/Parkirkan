<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index()
    {
        return Transaction::with('vehicle', 'officer', 'area')->latest()->get();
    }

    public function show(Transaction $transaction)
    {
        return $transaction->load('vehicle', 'officer', 'area');
    }

    // Usually transactions are created via Check-in/Check-out flows in VehicleController,
    // but standard CRUD might be needed for admin edits.
    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return response()->noContent();
    }
}
