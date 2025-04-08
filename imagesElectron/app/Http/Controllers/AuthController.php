<?php

namespace App\Http\Controllers;

use Throwable;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function signup(Request $request)
    {
        try {
            $isValidated = Validator::make($request->all(), [
                "name" => "required|string|max:255",
                "email" => "required|string|email|max:255|unique:users",
                "password" => [
                    "required",
                    "string",
                    Password::min(8)
                        ->mixedCase()
                        ->numbers()
                        ->symbols(),
                ],
            ]);

            if ($isValidated->fails()) {
                return errorMessageResponse(false, "Validation Error", $isValidated->errors(), 401);
            }

            $user = new User;
            $user->name = $request["name"];
            $user->email = $request["email"];
            $user->password = bcrypt($request["password"]);
            $user->ip = $request["ip"];
            $user->geolocation = json_encode($request["geolocation"]);
            // $user->ip = $request->ip ?? $user->ip;
            // if ($request->has('geolocation')) {
            //     $user->geolocation = json_encode($request->geolocation);
            // }
            // $user->ip = $request["ip"];
            // $user->geolocation = $request["geolocation"];
            $user->save();
            $user->token = Auth::login($user);

            return messageResponse(true, "User Signed Up Successfully", 200, $user);
        } catch (\Throwable $e) {
            return errorMessageResponse(false, null, $e->getMessage(), 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $isValidated = Validator::make($request->all(), [
                "email" => "required|string|email",
                "password" => "required|string",
            ]);

            if ($isValidated->fails()) {
                return errorMessageResponse(false, $isValidated->errors(), "Unauthenticated User", 401);
            }

            $credentials = $request->only('email', 'password');

            $token = Auth::attempt($credentials);
            if (!$token) {
                return errorMessageResponse(false, "Access Error", "Unauthorized Access", 401);
            }

            // $user = Auth::user();
            $authUser = Auth::user();
            $user = User::find($authUser->id);
            $user->ip = $request->ip ?? $user->ip;
            if ($request->has('geolocation')) {
                $user->geolocation = json_encode($request->geolocation);
            }
            $user->save();

            $user->token = $token;

            return messageResponse(true, "Login Successful", 200, $user);
        } catch (\Throwable $e) {
            return errorMessageResponse(false, null, $e->getMessage(), 401);
        }
    }

    public function logout()
    {
        Auth::logout();
        return messageResponse(true, "Successfully logged out", 200);
    }

    public function refresh()
    {
        $token = Auth::refresh();
        $user = Auth::user();
        $user->token = $token;
        $user->type = "bearer";
        return messageResponse(true, "refreshed", 200, $user);
    }
}
