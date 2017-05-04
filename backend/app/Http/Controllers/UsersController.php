<?php

namespace App\Http\Controllers;

use Log;
use Auth;
use App\Role;
use App\User;
use App\Stream;
use Carbon\Carbon;

class UsersController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => []]);
    }

    public static function getByName($username)
    {
        $user = User::firstOrCreate(['username'=>$username]);
        if (! $user->hasRole('user')) {
            $user->attachRole(Role::where('name', 'user')->first());
        }

        return $user;
    }

    public function getMe()
    {
        $user = Auth::user();
        $user['has_unplayed_song'] = User::first()->hasUnplayedSong();

        return $user;
    }

    public function getAll()
    {
        if (! Auth::user()->hasRole('admin')) {//TODO middleware perhaps?
            return ['not authorized'];
        }
        $users = User::all();

        return $users;
    }

    public function giveCredits($id, $credits)
    {
        if (! Auth::user()->hasRole('admin')) {//TODO middleware perhaps?
            return ['not authorized'];
        }
        $user = User::find($id);
        if (! $user) {
            return ['user not found'];
        }
        $user->giveCredits($credits, ['admin-give'=>Auth::user()->id]);

        return ['ok'];
    }

    public static function giveWatchingCredits()
    {
        if (! Stream::isStreaming()) {
            return;
        }
        foreach (TwitchAPIController::getUsersWatching() as $username) {
            $user = self::getByName($username);
            $user->last_seen = Carbon::now();
            $user->save();
            $minutes_since_active = Carbon::now()->diffInMinutes($user->last_message);
            Log::info($username.' last active '.$minutes_since_active.' minutes ago');
            $user->increment('minutes_watched', GeneralController::WATCHING_CREDITS_MINUTE_CUTOFF);
            if ($minutes_since_active < GeneralController::WATCHING_CREDITS_MINUTE_CUTOFF + 1) {// if they were active in the last X
                $user->giveCredits(GeneralController::WATCHING_CREDITS_PER_N_MINUTES, 'watching');
                $user->increment('minutes_watched_active', GeneralController::WATCHING_CREDITS_MINUTE_CUTOFF);
            }
        }
    }
}
