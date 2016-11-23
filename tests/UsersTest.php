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
}
