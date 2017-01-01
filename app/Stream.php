<?php
namespace App;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
class Stream extends Model
{
    /**
     * Gets the active stream_id, or null.
     * @return int|null
     */
    public static function getActiveID()
    {
        $stream = self::where('streaming', true)->first();
        return $stream ? $stream->id : null;
    }
    /**
     * Starts a stream session, if no active one exists.
     * @return bool success
     */
    public static function startSession()
    {
        if (self::getActiveID() != null) {
            //there's already an active session
            return false;
        }
        $session = new self();
        $session->streaming = true;
        $session->save();

        return true;
    }
    /**
     * Finishes a stream session, if there is an active one.
     * @return bool
     */
    public static function finishSession()
    {
        $active_id = self::getActiveID();
        if ($active_id == null) {
            //there's not an active session!
            return false;
        }
        $active = self::find($active_id);
        $active->streaming = false;
        $active->finished_at = Carbon::now();
        $active->save();

        return true;
    }
}