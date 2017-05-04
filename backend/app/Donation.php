<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $fillable = ['donation_id'];
    protected $dates = [
        'created_at',
        'updated_at',
        'donated_at',
    ];
}
