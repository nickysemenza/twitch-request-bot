<?php namespace App\Http\Controllers;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Log;
class ChatController extends Controller {
    public static function sendChatMessage($message) {
        $client = new Client();
        $response = $client->request('POST', env('IRC_RELAY').'/msg', [
            'form_params' => [
                'msg' => $message
            ]
        ]);
        if($response->getStatusCode()!=200)
            Log::info("sending message broke");
        Log::info("[CHAT][OUT] ".$message);
        //TODO: error handling
    }
    public function incomingChatMessage(Request $request) {
        $token = $request->get('token');
        if($token!=env('INTERNAL_TOKEN'))
            return ['bad internal token'];

        $message = $request->get('message');
        $sender = $request->get('sender');

        Log::info("[CHAT][IN] ".$sender.": ".$message);

        self::sendChatMessage("hi there @".$sender);
        return ['ok'];
    }
}
