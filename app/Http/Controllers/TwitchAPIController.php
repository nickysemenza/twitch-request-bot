<?php namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Log;
class TwitchAPIController extends Controller {
    public static function getUsername($token)
	{
		$client = new Client();
		$response = $client->request('GET', 'https://api.twitch.tv/kraken/user', [
            'form_params' => [
                'oauth_token' => $token
            ]
        ]);
		//TODO: error handling
		return json_decode($response->getBody(),true)['name'];
	}
	
	public static function getToken($code) {
		$client = new Client();
		$response = $client->request('POST', 'https://api.twitch.tv/kraken/oauth2/token', [
    	'form_params' => [
	        'client_id' => env('TWITCH_CLIENT_ID'),
	 		'client_secret' => env('TWITCH_CLIENT_SECRET'),
	 		'grant_type' => 'authorization_code',
	 		'redirect_uri' => env('APP_URL').'/api/twitch_cb',
	 		'code' => $code,
	 		'state' => 'aaa'
	    ]
	]);
		//TODO: error handling
		return json_decode($response->getBody(),true)['access_token'];
	}
}
