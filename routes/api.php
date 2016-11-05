<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('twitch_cb', 'GeneralController@twitchAuthCallback');
Route::get('test', 'GeneralController@test');
Route::get('songqueue', 'GeneralController@getSongQueue');

Route::group(array('prefix' => 'users/me'), function() {
    Route::get('/', 'UsersController@getMe');
    Route::put('/', 'UsersController@updateMe');
});