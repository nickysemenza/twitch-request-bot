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

Route::get('system', 'GeneralController@getSystemSettings');
Route::post('system/requestsToggle/{mode}','GeneralController@requestsToggle');


Route::get('songqueue', 'SongController@getSongQueue');
Route::post('song', 'SongController@addSongRequest');
Route::post('song/play/{which}/{id}', 'SongController@selectSongForPlaying');


Route::post('irc/message', 'ChatController@incomingChatMessage');


Route::get('users', 'UsersController@getAll');
Route::post('users/{id}/givecredits/{credits}', 'UsersController@giveCredits');

Route::group(array('prefix' => 'users/me'), function() {
    Route::get('/', 'UsersController@getMe');
    Route::put('/', 'UsersController@updateMe');
});