<?php

namespace App\Http\Controllers;

use Log;
use Auth;
use App\User;
use App\SongRequest;
use App\SystemSetting;
use Illuminate\Http\Request;

class SongController extends Controller
{
    public function __construct()
    {
        $this->middleware('jwt.auth', ['except' => ['getSongQueue']]);
    }

    public function getSongQueue()
    {
        return SongRequest::
        with(
            [
                'user'=> function ($query) {
                    $query->select('id', 'username'); //we ony want to grab id, username, so we don't leak credits
                },
            ]
        )->where('status', '!=', SongRequest::PLAYED)->orderBy('priority', 'DESC')->get();
    }

    public function addSongRequest(Request $request)
    {
        //        Log::info($request->all());
        $user = Auth::user();
        $url = $request->get('youtube_url');
        $options = ['instrument'=>$request->get('instrument')];
        $result = $user->requestSong($url, $request->get('use_priority'), $options);

        return $result;
    }

    public function selectSongForPlaying(Request $request, $mode, $id)
    {
        if (! Auth::user()->hasRole('admin')) {//TODO middleware perhaps?
            return ['not authorized'];
        }
        switch ($mode) {
            case 'first':
                $sr = SongRequest::where('status', '=', SongRequest::NOT_PLAYED)->orderBy('priority', 'DESC')->first();
                break;
            case 'random':
                $sr = SongRequest::where('status', '=', SongRequest::NOT_PLAYED)->inRandomOrder()->first();
                break;
            case 'specific':
                $sr = SongRequest::find($id);
                break;
            default:
                //default to random
                $sr = SongRequest::where('status', '=', SongRequest::NOT_PLAYED)->orderBy('priority', 'DESC')->first();
                break;

        }
        if ($sr) {
            $sr->setNowPlaying();

            return ['ok'];
        }
        //no unplayed songs
        return ['no'];
    }

    public function deleteSong(Request $request, $mode, $id)
    {
        //todo: give back credits to person for deleted request
        if (! Auth::user()->hasRole('admin')) {//TODO middleware perhaps?
            return ['not authorized'];
        }
        switch ($mode) {
            case 'all':
                SongRequest::where('status', '=', SongRequest::NOT_PLAYED)->delete();
                break;
            case 'specific':
                SongRequest::find($id)->delete();
                break;

        }

        return ['ok'];
    }

    public static function requestsEnabled()
    {
        return SystemSetting::where('key', SystemSetting::REQUESTS_ENABLED)->first()->value;
    }
}
