<?php

use App\SystemSetting;
use Illuminate\Database\Seeder;

class SystemSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        SystemSetting::firstOrCreate(['key' => SystemSetting::REQUESTS_ENABLED, 'value'=>false]);
    }
}
