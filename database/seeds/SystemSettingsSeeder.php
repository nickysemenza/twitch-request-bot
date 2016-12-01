<?php
use Illuminate\Database\Seeder;
use App\SystemSetting;
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