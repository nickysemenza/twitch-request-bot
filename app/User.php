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
    public function hasUnplayedSong() {
        return SongRequest::where('user_id',$this->id)->where('status','!=',SongRequest::PLAYED)->count() > 0;
    }
    public function getUnplayedSongRequest() {
        return SongRequest::where('user_id',$this->id)->where('status','!=',SongRequest::PLAYED)->first();
    }
    public function useCredits($amt,$info = null) {
        if($amt > $this->credits)
            return false;
        $t = new CreditTransaction();
        $t->user_id = $this->id;
        $t->credit_used = $amt;
        $t->info = json_encode($info);
        $t->save();
        $this->credits -= $amt;
        $this->save();
        Log::info("used {$amt} credits for user {$this->id}");
        return true;
    }
    public function giveCredits($amt,$info = null) {
        $t = new CreditTransaction();
        $t->user_id = $this->id;
        $t->credit_gained = $amt;
        $t->info = json_encode($info);
        $t->save();
        $this->credits += $amt;
        $this->save();
    }

    public function requestSong($youtube_url, $is_priority = false, $options = null) {
        //TODO: validate youtube_url
        //return ['status'=>'error','error'=>'invalid youtube link'];

        $isUpdateRequest = $this->hasUnplayedSong();
        $numCreditsUsed = 0;

        $youtube_id = GeneralController::getYoutubeVideoID($youtube_url);
        $sr = new SongRequest();
        if($isUpdateRequest)
            $sr = $this->getUnplayedSongRequest();
        $sr->user_id = $this->id;
        $sr->youtube_id = $youtube_id;
        $sr->title = GeneralController::getYoutubeTitle($youtube_id);

        if($is_priority) {
            //we want to use credit for new priority request, or editing a request to make it now priority
            if(($isUpdateRequest && !$sr->priority) || !$isUpdateRequest)
                $numCreditsUsed+=5;
            $sr->priority = true;
        }

        if(isset($options['instrument'])) {
            $instrument = $options['instrument'];
            if ($instrument != "none" && $instrument != "") {
                if(!$isUpdateRequest || ($isUpdateRequest && !$sr->instrument))
                $numCreditsUsed += 5;
                $sr->instrument = $instrument;
            }
        }

        $sr->save();
        Log::info("need credits:".$numCreditsUsed." have: ".$this->credits);
        if($this->useCredits($numCreditsUsed,['song_request'=>$sr->id])) {
            return ['status'=>'ok'];
        }
        else {
            $sr->delete();//backtrack!
            return ['status'=>'error','error'=>'not enough credits'];
        }

    }
}
