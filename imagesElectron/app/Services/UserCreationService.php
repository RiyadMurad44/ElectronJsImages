<?php

namespace App\Services;

use Throwable;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserCreationService
{
    public static function signup($request)
    {
        try {
            $user = new User;
            $user->name = $request["name"];
            $user->email = $request["email"];
            $user->password = bcrypt($request["password"]);
            $user->ip = $request["ip"];
            $user->geolocation = json_encode($request["geolocation"]);
            $user->save();
            $user->token = Auth::login($user);

            return $user;
        } catch (\Throwable $e) {
            throw $e;
        }
    }

    public static function login(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');

            $token = Auth::attempt($credentials);
            if (!$token) {
                return;
            }

            $authUser = Auth::user();
            $user = User::find($authUser->id);
            $user->ip = $request->ip ?? $user->ip;
            if ($request->has('geolocation')) {
                $user->geolocation = json_encode($request->geolocation);
            }
            $user->save();
            $user->token = $token;

            return $user;
        } catch (\Throwable $e) {
            return $e->getMessage();
        }
    }

    public static function logout()
    {
        return Auth::logout();
    }

    public static function refresh()
    {
        $token = Auth::refresh();
        $user = Auth::user();
        $user->token = $token;
        $user->type = "bearer";
        return $user;
    }
}
