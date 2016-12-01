<?php namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Role;
use App\SongRequest;
use App\SystemSetting;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Auth;
use App\User;
use Log;
use JWTAuth;
class GeneralController extends Controller {
    public function __construct() {
        $this->middleware('jwt.auth', ['except' => ['twitchAuthCallback','test','getSystemSettings']]);
    }

    public static function getYoutubeVideoID($url)
    {
        preg_match("/^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'>]+)/", $url, $matches);
        return $matches[1];//TODO: error checking
    }

    public function test() {
        return ["has_unplayed_song"=>User::first()->hasUnplayedSong()];
        return "hi";
    }
    public function twitchAuthCallback(Request $request)
	{
		$code = $request->all()['code'];
		$token = TwitchAPIController::getToken($code);
        $username = TwitchAPIController::getUsername($token);
		$user = UsersController::getByName($username);

        $roles = $user->roles()->get()->pluck('name');
        $jwt = JWTAuth::fromUser($user,[
            'exp' => strtotime('+1 year'),//TODO: refresh tokens
            'username'=>$user->username,
            'roles'=>$roles
        ]);

        Log::info("issuing jwt for user ".$user->id.": ".$jwt);
		header("Location: ".env('FRONTEND_ADDRESS')."/auth?jwt=".$jwt);
	}
	public static function getYoutubeTitle($video_id) {
        $url="https://www.googleapis.com/youtube/v3/videos?id=".$video_id."&part=snippet&key=".env('YOUTUBE_API_KEY');
        $client = new Client();
        $response = $client->request('GET', $url);
        //TODO: error handling
        return json_decode($response->getBody(),true)['items'][0]['snippet']['title'];
    }
    public function getSystemSettings() {
        return
        [
            'settings'=>[
                SystemSetting::REQUESTS_ENABLED => SongController::requestsEnabled()
            ]
        ];
    }
    public function requestsToggle($mode) {
        Log::info($mode);
        if(!Auth::user()->hasRole('admin'))//TODO middleware perhaps?
            return ['not authorized'];
        $setting = SystemSetting::where('key',SystemSetting::REQUESTS_ENABLED)->first();
        $setting->value = ($mode == "true");
        $setting->save();
        return ['ok'];
    }
}
