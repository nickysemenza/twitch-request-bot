<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Http\Request;

class TwitchAPIController extends Controller
{
    public static function getUsername($token)
    {
        $client = new Client();
        $response = $client->request('GET', 'https://api.twitch.tv/kraken/user', [
            'form_params' => [
                'oauth_token' => $token,
                'client_id'   => env('TWITCH_CLIENT_ID'),

            ],
        ]);
        //TODO: error handling
        return json_decode($response->getBody(), true)['name'];
    }

    public static function getToken($code)
    {
        $client = new Client();
        $response = $client->request('POST', 'https://api.twitch.tv/kraken/oauth2/token', [
        'form_params' => [
            'client_id'     => env('TWITCH_CLIENT_ID'),
            'client_secret' => env('TWITCH_CLIENT_SECRET'),
            'grant_type'    => 'authorization_code',
            'redirect_uri'  => env('APP_URL').'/api/twitch_cb',
            'code'          => $code,
            'state'         => 'aaa',
        ],
    ]);
        //TODO: error handling
        return json_decode($response->getBody(), true)['access_token'];
    }

    public static function getUsersWatching()
    {
        $client = new Client();
        $response = $client->request('GET', 'https://tmi.twitch.tv/group/user/cheeseburger97/chatters', [
            'form_params' => [
                'client_id' => env('TWITCH_CLIENT_ID'),

            ],
        ]);
        $chatters = json_decode($response->getBody(), true)['chatters'];
        $users = [];
        foreach ($chatters as $x) {
            foreach ($x as $u) {
                $users[] = $u;
            }
        }

        return $users;
    }
}
