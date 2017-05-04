<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\UsersController;

class GiveUsersWatchingCredit extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:watching';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Give users credit who are currently watching';

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
        UsersController::giveWatchingCredits();
    }
}
