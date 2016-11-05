<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SongRequest extends Model
{
    const NOT_PLAYED = 0;
    const PLAYING = 1;
    const PLAYED = 2;
}
