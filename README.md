# Twitch Songrequest Bot

[![StyleCI](https://styleci.io/repos/73110359/shield?branch=master)](https://styleci.io/repos/73110359)
[![Build Status](https://travis-ci.org/nickysemenza/twitch-request-bot.svg?branch=master)](https://travis-ci.org/nickysemenza/twitch-request-bot)
[![codecov](https://codecov.io/gh/nickysemenza/twitch-request-bot/branch/master/graph/badge.svg)](https://codecov.io/gh/nickysemenza/twitch-request-bot)

Used for cheeseburger.tv 


## Components

1. IRC relay (node)
2. Backend (API) server (php + laravel)
3. Frontend web interface (react.js)

### Dev Setup

Prereqs: `node`, `npm`, `composer` (php package manager), `mysql`

For the IRC relay:

1. `cd irc-relay`
2. `npm install`
3. `cp settings.example.js settings.js` and populate secrets
4. `node server.js` to run


****

For the backend:

1. `cd backend`
2. `composer install`
3. `cp .env.example .env` and populate secrets
4. `php artisan serve` to run, or point nginx to `public/index.php`
5. `php artisan migrate` to build up the mysql tables
6. `php artisan seed` (one-off) to populate the roles table
7. setup the laravel scheduler with cron ([docs](laravel.com/docs/5.2/scheduling))


****

For the frontend:

1. `cd frontend`
2. `npm install`
3. `npm start` to start the hotloader on :3000

****



### Production
* run irc-relay's `server.js` with pm2
* run backend the same, but with appropriate .env
* for the frontend, run `npm run build`, then serve `build/index.html` via nginx



