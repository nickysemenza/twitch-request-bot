<?php

namespace App\Console\Commands;

use App\Http\Controllers\TwitchAPIController;
use Illuminate\Console\Command;

class ProcessDonations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:donations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process donations';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        TwitchAPIController::getDonations();
        TwitchAPIController::processDonations();
    }
}
