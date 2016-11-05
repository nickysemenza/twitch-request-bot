<?php namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Role;
use Illuminate\Http\Request;
use App\User;
use Log;
use JWTAuth;
class GeneralController extends Controller {
    public function test() {
        return "hi";
    }
    public function twitchAuthCallback(Request $request)
	{
		// $code = $request->all()['code'];
		// $token = TwitchAPIController::getToken($code);

        $username = TwitchAPIController::getUsername($token);
		$user =  User::firstOrCreate(['username'=>$username]);

        if(!$user->hasRole('user'))
            $user->attachRole(Role::where('name','user')->first());

        $roles = $user->roles()->get()->pluck('name');
        $jwt = JWTAuth::fromUser($user,['username'=>$user->username,'roles'=>$roles]);

        Log::info("issuing jwt for user ".$user->id.": ".$jwt);
		header("Location: ".env('FRONTEND_ADDRESS')."/auth?jwt=".$jwt);
		// return $jwt;
	}
}
