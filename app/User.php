<?php

namespace App;
use App\Http\Controllers\GeneralController;
use Zizaco\Entrust\Traits\EntrustUserTrait;
use Log;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;
    use EntrustUserTrait;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function requestSong($youtube_url, $is_priority = false, $options = null) {
        $user = $this;
        //TODO: validate youtube_url

        $numCreditsUsed = 0;

        $youtube_id = GeneralController::getYoutubeVideoID($youtube_url);
        $sr = new SongRequest();
        $sr->user_id = $user->id;
        $sr->youtube_id = $youtube_id;
        $sr->title = GeneralController::getYoutubeTitle($youtube_id);

        if($is_priority) {
            $numCreditsUsed+=5;
            $sr->priority = true;
        }

        //todo: verify instrument is valid
        if(isset($options['instrument'])) {
            $instrument = $options['instrument'];
            if ($instrument != "none") {
                $numCreditsUsed += 5;
                $sr->instrument = $instrument;
            }
        }

        Log::info("need credits:".$numCreditsUsed." have: ".$user->credits);
        if($user->credits>=$numCreditsUsed) {
            $sr->save();
            return ['status'=>'ok'];
        }
        else {
            return ['status'=>'error','error'=>'not enough credits'];
        }


    }
}
