<?php

namespace App\Console;

use App\Console\Commands\ProcessDonations;
use Illuminate\Console\Scheduling\Schedule;
use App\Console\Commands\GiveUsersWatchingCredit;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        GiveUsersWatchingCredit::class,
        ProcessDonations::class,
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param \Illuminate\Console\Scheduling\Schedule $schedule
     *
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->command('users:watching')->cron('*/20 * * * *');
        $schedule->command('users:donations')->everyFiveMinutes();
    }

    /**
     * Register the Closure based commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        require base_path('routes/console.php');
    }
}
