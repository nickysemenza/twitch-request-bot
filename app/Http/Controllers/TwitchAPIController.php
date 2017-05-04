<?php

namespace App\Http\Controllers;

use Log;
use App\User;
use App\Stream;
use App\Donation;
use Carbon\Carbon;
use App\SystemSetting;
use GuzzleHttp\Client;

class TwitchAPIController extends Controller
{
    public static function getUsername($token)
    {
        $client = new Client();
        $response = $client->request('GET', 'https://api.twitch.tv/kraken/user', [
            'headers' => [
                'Authorization' => 'OAuth '.$token,
                'Client-ID'   => env('TWITCH_CLIENT_ID'),
                'Accept' => 'application/vnd.twitchtv.v5+json',

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

    /**
     * Generates access and refresh tokens from TwitchAlerts authorization code.
     * @param $code
     * @return string
     */
    public static function processTwitchAlertsAuthorizationCode($code)
    {
        $client = new Client();
        try {
            $response = $client->post('https://www.twitchalerts.com/api/v1.0/token', [
                'form_params' => [
                    'grant_type'    => 'authorization_code',
                    'client_id'     => env('TWITCHALERTS_CLIENT_ID'),
                    'client_secret' => env('TWITCHALERTS_CLIENT_SECRET'),
                    'redirect_uri'  => env('APP_URL').'/api/twitchalerts_cb',
                    'code'          => $code,
                ],
            ]);
            $result = $response->getBody();
        } catch (Exception $e) {
            //failed
            Log::error('processTwitchAlertsAuthorizationCode failure');
            Log::error($e->getMessage());

            return false;
        }
        $result = json_decode($result, true);
        self::saveTwitchAlertsData($result['access_token'], $result['refresh_token']);

        return true;
    }

    /**
     * Saves TwitchAlerts access and refresh tokens.
     * @param $access_token
     * @param $refresh_token
     */
    public static function saveTwitchAlertsData($access_token, $refresh_token)
    {
        //access
        $access = SystemSetting::firstOrNew(['key'=>SystemSetting::DONATIONS_ACCESS_TOKEN]);
        $access->value = $access_token;
        $access->save();
        //refresh
        $refresh = SystemSetting::firstOrNew(['key'=>SystemSetting::DONATIONS_REFRESH_TOKEN]);
        $refresh->value = $refresh_token;
        $refresh->save();
        //set expiry as one hour from now
        $expires_at = SystemSetting::firstOrNew(['key'=>SystemSetting::DONATIONS_ACCESS_TOKEN_EXPIRES_AT]);
        $expires_at->value = Carbon::now()->addHour(1);
        $expires_at->save();
    }

    /**
     * Refreshes TwitchAlerts OAuth.
     * @return bool
     */
    public static function twitchAlertsRefresh()
    {
        $expires = SystemSetting::where('key', SystemSetting::DONATIONS_ACCESS_TOKEN_EXPIRES_AT)->first();
        $refresh = SystemSetting::where('key', SystemSetting::DONATIONS_REFRESH_TOKEN)->first();
        if (! $expires || ! $refresh) {
            return false; //oops
        }
        if (Carbon::parse($expires->value)->gt(Carbon::now()->copy()->addMinute(1))) {
            return false; //too early to refresh
        }
        $client = new Client();
        try {
            $response = $client->post('https://www.twitchalerts.com/api/v1.0/token', [
                'form_params' => [
                    'grant_type'    => 'refresh_token',
                    'client_id'     => env('TWITCHALERTS_CLIENT_ID'),
                    'client_secret' => env('TWITCHALERTS_CLIENT_SECRET'),
                    'redirect_uri'  => env('APP_URL').'/api/twitchalerts_cb',
                    'refresh_token' => $refresh->value,
                ],
            ]);

            $result = $response->getBody();
        } catch (Exception $e) {
            //failed
            Log::error('twitchAlertsRefresh failure');
            Log::error($e->getMessage());

            return false;
        }
        $result = json_decode($result, true);
        self::saveTwitchAlertsData($result['access_token'], $result['refresh_token']);

        return true;
    }

    /**
     * Retrieves all the donations from TwitchAlerts, paginating.
     * @return bool
     */
    public static function getDonations()
    {
        $i = true;
        $oldestID = 0;
        do {
            $res = self::saveDonationsPage($oldestID);
            $last = end($res);
            if ($last) {
                $oldestID = $last['donation_id'];
            } else {
                $i = false;
            }
        } while ($i);

        return true;
    }

    /**
     * Saved a page of donations, before a given donation_id (chronologically).
     * @param $before string donation_id
     * @return bool
     */
    public static function saveDonationsPage($before)
    {
        self::twitchAlertsRefresh();
        Log::info('getting donations before '.$before);
        $client = new Client();

        try {
            $response = $client->get('https://www.twitchalerts.com/api/v1.0/donations', [
                'query' => [
                    'access_token'  => SystemSetting::where('key', SystemSetting::DONATIONS_ACCESS_TOKEN)->first()->value,
                    'limit'         => 50,
                    'currency'      => 'USD',
                    'before' => $before,
                ],
            ]);

            $result = $response->getBody();
        } catch (Exception $e) {

            //failed
            $result = $e->getMessage();
            Log::error($result);

            return false;
        }
        $result = json_decode($result, true)['data'];
        foreach ($result as $d) {
            $record = Donation::firstOrNew(['donation_id'=>$d['donation_id']]);
            $user = UsersController::getByName($d['name']);
            $record->user_id = $user->id;
            $record->amount = $d['amount'];
            $record->name = $d['name'];
            $record->donated_at = Carbon::createFromTimestampUTC($d['created_at']);
            $record->save();
        }

        return $result;
    }

    /**
     * Processes the donations in the database; assigns credit to the users.
     * @return bool
     */
    public static function processDonations()
    {
        foreach (Donation::where('processed', false)->get() as $d) {
            $user = UsersController::getByName($d['name']); //todo what if null?
            $user->giveCredits(ceil($d['amount'] * GeneralController::CREDITS_PER_DOLLAR), ['donation'=>['id'=>$d['donation_id']]]);
            $d->processed = true;
            $d->stream_id = Stream::getActiveID();
            $d->save();
        }

        return true;
    }

    /**
     * Helps create a fake donation.
     * @param $user
     * @param $amt
     * @return status
     */
    public static function fakeDonation($user, $amt)
    {
        self::twitchAlertsRefresh();

        $client = new Client();
        try {
            $response = $client->post('https://www.twitchalerts.com/api/v1.0/donations', [
                'form_params' => [
                    'access_token'  => SystemSetting::where('key', SystemSetting::DONATIONS_ACCESS_TOKEN)->first()->value,
                    'name' => $user,
                    'identifier' => $user,
                    'amount' => $amt,
                    'currency' => 'USD',
                    'message' => 'test for '.$user.'!',
                ],
            ]);

            $result = $response->getBody();
        } catch (Exception $e) {
            //failed
            $result = $e->getResponse()->json();
        }

        return $result;
    }
}
