# twitch-request-bot-backend


[![StyleCI](https://styleci.io/repos/74626029/shield?branch=master)](https://styleci.io/repos/74626029)

[![Build Status](https://travis-ci.org/nickysemenza/twitch-request-bot-backend.svg?branch=master)](https://travis-ci.org/nickysemenza/twitch-request-bot-backend)


## setup

1. `cd backend`
2. `composer install`
3. `cp .env.example .env` and populate secrets
4. `php artisan serve` to run, or point nginx to `public/index.php`
5. `php artisan migrate` to build up the mysql tables
6. `php artisan seed` (one-off) to populate the roles table
7. setup the laravel scheduler with cron ([docs](laravel.com/docs/5.2/scheduling))
