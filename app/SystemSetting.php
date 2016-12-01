<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $fillable = ['key','value'];
    const REQUESTS_ENABLED = 'requests_enabled';
    public function getValueAttribute($value)
    {
        //cast REQUESTS_ENABLED to boolean
        if($this->key == self::REQUESTS_ENABLED)
            return (bool) $value;
        return $value;
    }
}
