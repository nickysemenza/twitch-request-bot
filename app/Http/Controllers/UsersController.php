<?php namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Role;
use Illuminate\Http\Request;
use App\User;
use Auth;
use Log;
use JWTAuth;
class UsersController extends Controller {
    public function __construct() {
        $this->middleware('jwt.auth', ['except' => []]);
    }
    public function getMe() {
        return Auth::user();
    }
}
