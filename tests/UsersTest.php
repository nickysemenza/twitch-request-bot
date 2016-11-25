<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use App\Http\Controllers\UsersController;
class UsersTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testCreateUser()
    {
        $faker = Faker\Factory::create();
        $username = $faker->username;
        $user = UsersController::getByName($username);
        $user = \App\User::find($user->id);
        $this->assertTrue($user->hasRole('user'));
        $this->assertFalse($user->hasRole('admin'));
        $this->seeInDatabase('users', ['username' => $username]);
    }
    public function testAddCredits() {
        $faker = Faker\Factory::create();
        $username = $faker->username;
        $user = UsersController::getByName($username);
        $user = \App\User::find($user->id);
        $user->giveCredits(6,['k'=>'v']);
        $user = $user->fresh();
        $this->assertTrue($user->credits==6);
        $this->seeInDatabase('credit_transactions', ['user_id' => $user->id,'credit_gained'=>6,'info'=> json_encode(['k'=>'v'])]);

        $use4 = $user->useCredits(4,['a'=>'b']);
        $this->assertTrue($use4);
        $this->assertTrue($user->credits==2);
        $this->seeInDatabase('credit_transactions', ['user_id' => $user->id,'credit_used'=>4,'info'=> json_encode(['a'=>'b'])]);
        $use3 = $user->useCredits(3,['a'=>'b']);
        $this->assertFalse($use3);
        $this->assertTrue($user->credits==2);

        $this->assertTrue($user->requestSong("https://www.youtube.com/watch?v=HBT2J4tMyGI",true) == ['status'=>'error','error'=>'not enough credits']);
        $this->assertTrue($user->requestSong("https://www.youtube.com/watch?v=HBT2J4tMyGI",false) == ['status'=>'ok']);

        $user->giveCredits(6,['k'=>'v']);

        $this->assertTrue($user->requestSong("https://www.youtube.com/watch?v=85ftfVUTzM4",false) == ['status'=>'ok']);
        $this->assertTrue($user->getUnplayedSongRequest()->instrument == null);
        $this->assertTrue($user->requestSong("https://www.youtube.com/watch?v=85ftfVUTzM4",false,['instrument'=>'guitar']) == ['status'=>'ok']);
        $this->assertTrue($user->getUnplayedSongRequest()->instrument == 'guitar');
    }
}
