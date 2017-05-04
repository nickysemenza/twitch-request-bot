<?php

namespace App\Http\Controllers;

use App\Stream;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Log;

class ChatController extends Controller
{
    public static function sendChatMessage($message)
    {
        $client = new Client();
        $response = $client->request('POST', env('IRC_RELAY').'/msg', [
            'form_params' => [
                'msg' => $message,
            ],
        ]);
        if ($response->getStatusCode() != 200) {
            Log::info('sending message broke');
        }
        Log::info('[CHAT][OUT] '.$message);
        //TODO: error handling
    }

    public static function processChatMessage($sender, $message)
    {
        $user = UsersController::getByName($sender);
        //set the user's last_message attr to NOW
        $user->last_message = Carbon::now();
        $user->save();
        $atSender = '@'.$sender;
        $words = explode(' ', $message);
        Log::info($words);
        if (count($words) == 0) {
            return;
        }
        switch ($words[0]) {
            case '!sr':
            case '!songrequest':
                if (!Stream::isStreaming()) {
                    self::sendChatMessage($atSender.' I am not streaming right now!');
                    break;
                }
                if (!SongController::requestsEnabled()) {
                    self::sendChatMessage($atSender.' requesting is not enabled right now!');
                    break;
                }

                if ($user->hasUnplayedSong()) {
                    self::sendChatMessage($atSender.' you have an unplayed request, please use !editsong to change your request');
                    break;
                }

                if (count($words) == 1) {//no parameters
                    self::sendChatMessage($atSender.' please provide a youtube link.');
                }
                if (count($words) == 2) {//provided just 1 param
                    $result = $user->requestSong($words[1]);
                    if ($result['status'] == 'ok') {
                        self::sendChatMessage($atSender.' your request has been added to the queue!');
                    } else {
                        self::sendChatMessage($atSender.' your request failed: '.$result['error']);
                    }
                }
                if (count($words) == 3) {//provided 2 params
                    $keyword = $words[2];
                    if ($keyword == 'vip' || $keyword == 'priority') {
                        $result = $user->requestSong($words[1], true);
                        if ($result['status'] == 'ok') {
                            self::sendChatMessage($atSender.' your priority request has been added to the queue!');
                        } else {
                            self::sendChatMessage($atSender.' your priority request failed: '.$result['error']);
                        }
                        break;
                    }
                    self::sendChatMessage($atSender.' please use proper syntax, or visit: '.env('FRONTEND_ADDRESS').' to make a request');
                }

                break;
            case '!p':
            case '!points':
                self::sendChatMessage($atSender.' you have '.$user->credits.' points');
                break;
            case '!sq':
            case '!songqueue':
                self::sendChatMessage($atSender.' please visit '.env('FRONTEND_ADDRESS').' to view the queue');
                break;
            case '!editsong':
                if (!Stream::isStreaming()) {
                    self::sendChatMessage($atSender.' I am not streaming right now!');
                    break;
                }
                if (!SongController::requestsEnabled()) {
                    self::sendChatMessage($atSender.' requesting is not enabled right now!');
                    break;
                }
                if (!$user->hasUnplayedSong()) {
                    self::sendChatMessage($atSender." you don't have any unplayed requests!");
                    break;
                }
                if (count($words) == 1) {//no parameters
                    self::sendChatMessage($atSender.', please provide a youtube link.');
                }
                if (count($words) == 2) {//provided just 1 param
                    $result = $user->requestSong($words[1]);
                    if ($result['status'] == 'ok') {
                        self::sendChatMessage($atSender.' your request has been updated in the queue!');
                    } else {
                        self::sendChatMessage($atSender.' your request failed: '.$result['error']);
                    }
                }

        }
    }

    public function incomingChatMessage(Request $request)
    {
        $token = $request->get('token');
        if ($token != env('INTERNAL_TOKEN')) {
            return ['bad internal token'];
        }

        $message = $request->get('message');
        $sender = $request->get('sender');

        Log::info('[CHAT][IN] '.$sender.': '.$message);

        self::processChatMessage($sender, $message);
//        self::sendChatMessage("hi there @".$sender);
        return ['ok'];
    }
}
