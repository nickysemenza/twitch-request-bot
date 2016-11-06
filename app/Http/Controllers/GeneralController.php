<?php namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Role;
use App\SongRequest;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Auth;
use App\User;
use Log;
use JWTAuth;
class GeneralController extends Controller {
    public function __construct() {
        $this->middleware('jwt.auth', ['except' => ['twitchAuthCallback','test']]);
    }
    public function test() {
        return "hi";
    }
    public function twitchAuthCallback(Request $request)
	{
		$code = $request->all()['code'];
		$token = TwitchAPIController::getToken($code);
        $username = TwitchAPIController::getUsername($token);
		$user =  User::firstOrCreate(['username'=>$username]);

        if(!$user->hasRole('user'))
            $user->attachRole(Role::where('name','user')->first());

        $roles = $user->roles()->get()->pluck('name');
        $jwt = JWTAuth::fromUser($user,['username'=>$user->username,'roles'=>$roles]);

        Log::info("issuing jwt for user ".$user->id.": ".$jwt);
		header("Location: ".env('FRONTEND_ADDRESS')."/auth?jwt=".$jwt);
	}
	public static function getYoutubeTitle($video_id) {
        $url="https://www.googleapis.com/youtube/v3/videos?id=".$video_id."&part=snippet&key=AIzaSyDPmhqyYOOJxbvb27UMEFrxsLz5t7yZ-KE";

        $client = new Client();
        $response = $client->request('GET', $url);
        //TODO: error handling
        return json_decode($response->getBody(),true)['items'][0]['snippet']['title'];
    }
	public function getSongQueue() {
	    return SongRequest::where('status','!=',SongRequest::PLAYED)->orderBy('priority','DESC')->get();
    }
    public function addSongRequest(Request $request) {
        $url = $request->get('youtube_url');
        preg_match("/^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'>]+)/", $url, $matches);
        $youtube_id = $matches[1];
        $sr = new SongRequest();
        $sr->user_id = Auth::user()->id;
        $sr->youtube_id = $youtube_id;
        $sr->title = self::getYoutubeTitle($youtube_id);
        $sr->save();
        return ['ok'];
    }
}
