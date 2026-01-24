<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id',
        'area_id',
        'rate_id',
        'officer_id',
        'ticket_number',
        'check_in_time',
        'check_out_time',
        'duration_hours',
        'total_cost',
        'payment_status',
        'status',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function area()
    {
        return $this->belongsTo(ParkingArea::class);
    }

    public function rate()
    {
        return $this->belongsTo(ParkingRate::class);
    }

    public function officer()
    {
        return $this->belongsTo(User::class, 'officer_id');
    }
}
