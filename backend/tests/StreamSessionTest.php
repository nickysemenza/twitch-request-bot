<?php

use App\Stream;

class StreamSessionTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testStartFinishStream()
    {
        //clear, reset
        Stream::finishSession();
        //now there is definitely not one active
        //try finishing an already finished
        self::assertFalse(Stream::finishSession());
        //now let's start a new session
        $new = Stream::startSession();
        self::assertTrue($new);
        //so we shouldn't be able to restart...
        self::assertFalse(Stream::startSession());

        //but we can finish!
        self::assertTrue(Stream::finishSession());
        //but only once...
        self::assertFalse(Stream::finishSession());
    }
}
