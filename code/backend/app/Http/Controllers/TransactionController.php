<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index()
    {
        return Transaction::with('vehicle', 'entryOfficer', 'exitOfficer', 'area')->latest()->get();
    }

    public function show(Transaction $transaction)
    {
        return $transaction->load('vehicle', 'entryOfficer', 'exitOfficer', 'area');
    }

    // Usually transactions are created via Check-in/Check-out flows in VehicleController,
    // but standard CRUD might be needed for admin edits.
    public function destroy(Transaction $transaction)
    {
        $transaction->delete();
        return response()->noContent();
    }
}
