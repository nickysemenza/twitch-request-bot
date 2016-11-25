<?php namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Role;
use Illuminate\Http\Request;
use App\User;
use Auth;
use Log;
use JWTAuth;
class UsersController extends Controller {
    public function __construct() {
        $this->middleware('jwt.auth', ['except' => []]);
    }

    public static function getByName($username)
    {
        $user =  User::firstOrCreate(['username'=>$username]);
        if(!$user->hasRole('user'))
            $user->attachRole(Role::where('name','user')->first());
        return $user;
    }

    public function getMe() {
        $user = Auth::user();
        $user["has_unplayed_song"] = User::first()->hasUnplayedSong();
        return $user;
    }
    public function getAll() {
        if(!Auth::user()->hasRole('admin'))//TODO middleware perhaps?
            return ['not authorized'];
        $users = User::all();
        return $users;
    }
    public function giveCredits($id, $credits) {
        if(!Auth::user()->hasRole('admin'))//TODO middleware perhaps?
            return ['not authorized'];
        $user = User::find($id);
        if(!$user)
            return ['user not found'];
        $user->giveCredits($credits,['admin-give'=>Auth::user()->id]);
        return ['ok'];
    }
}
