<?php

namespace App\Http\Controllers;

use App\Role;
use App\User;
use Auth;

class UsersController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => []]);
    }

    public static function getByName($username)
    {
        $user = User::firstOrCreate(['username'=>$username]);
        if (!$user->hasRole('user')) {
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
        if (!Auth::user()->hasRole('admin')) {//TODO middleware perhaps?
            return ['not authorized'];
        }
        $users = User::all();

        return $users;
    }

    public function giveCredits($id, $credits)
    {
        if (!Auth::user()->hasRole('admin')) {//TODO middleware perhaps?
            return ['not authorized'];
        }
        $user = User::find($id);
        if (!$user) {
            return ['user not found'];
        }
        $user->giveCredits($credits, ['admin-give'=>Auth::user()->id]);

        return ['ok'];
    }

    public static function giveWatchingCredits()
    {
        //TODO: make sure stream session is happening
        foreach (TwitchAPIController::getUsersWatching() as $user) {
            self::getByName($user)->giveCredits(1, 'watching');
        }
    }
}
