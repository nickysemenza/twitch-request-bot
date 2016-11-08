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

    public static function processChatMessage($sender, $message) {
        $words = explode(" ", $message);
        Log::info($words);
        if(sizeof($words)==0)
            return;
        switch($words[0]) {
            case "!sr":
            case "!songrequest":
                //TODO: this, also handing re-requesting
                //self::sendChatMessage("song request yay");
                break;
            case "!p":
            case "!points":
                $user = UsersController::getByName($sender);
                self::sendChatMessage("@".$sender." you have ".$user->credits." points");
                break;
            case "!sq":
            case "!songqueue":
                self::sendChatMessage("@".$sender.", please visit ".env("FRONTEND_ADDRESS")." to view the queue");
                break;
        }

    }

    public function incomingChatMessage(Request $request) {
        $token = $request->get('token');
        if($token!=env('INTERNAL_TOKEN'))
            return ['bad internal token'];

        $message = $request->get('message');
        $sender = $request->get('sender');

        Log::info("[CHAT][IN] ".$sender.": ".$message);

        self::processChatMessage($sender,$message);
//        self::sendChatMessage("hi there @".$sender);
        return ['ok'];
    }
}
