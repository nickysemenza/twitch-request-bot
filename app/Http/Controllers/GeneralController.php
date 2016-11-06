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
        $this->middleware('jwt.auth', ['except' => ['twitchAuthCallback','test','getSongQueue']]);
    }

    private static function getYoutubeVideoID($url)
    {
        preg_match("/^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'>]+)/", $url, $matches);
        return $matches[1];//TODO: error checking
    }

    public function test() {
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
	public function getSongQueue() {
	    return SongRequest::
        with(
            [
                'user'=>function($query) {
                    $query->select('id','username');//we ony want to grab id, username, so we don't leak credits
                }
            ]
        )->where('status','!=',SongRequest::PLAYED)->orderBy('priority','DESC')->get();
    }
    public function addSongRequest(Request $request) {
        $url = $request->get('youtube_url');
        $youtube_id = self::getYoutubeVideoID($url);
        $sr = new SongRequest();
        $sr->user_id = Auth::user()->id;
        $sr->youtube_id = $youtube_id;
        $sr->title = self::getYoutubeTitle($youtube_id);
        $sr->save();
        return ['ok'];
    }
}
