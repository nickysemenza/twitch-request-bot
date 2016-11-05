<?php namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\User;
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

		$jwt = JWTAuth::fromUser($user,['username'=>$user->username]);

		header("Location: ".env('FRONTEND_ADDRESS')."/auth?jwt=".$jwt);
		// return $jwt;
	}
}
