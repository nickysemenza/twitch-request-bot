<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SongRequest extends Model
{
    public function user() {
        return $this->hasOne('App\User','id','user_id');
    }
    const NOT_PLAYED = 0;
    const PLAYING = 1;
    const PLAYED = 2;
}
