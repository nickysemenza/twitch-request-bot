<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $fillable = ['key', 'value'];
    const REQUESTS_ENABLED = 'requests_enabled';
    const DONATIONS_ACCESS_TOKEN = 'donations_access_token';
    const DONATIONS_REFRESH_TOKEN = 'donations_refresh_token';
    const DONATIONS_ACCESS_TOKEN_EXPIRES_AT = 'donations_access_token_expires_at';

    public function getValueAttribute($value)
    {
        //cast REQUESTS_ENABLED to boolean
        if ($this->key == self::REQUESTS_ENABLED) {
            return (bool) $value;
        }

        return $value;
    }
}
