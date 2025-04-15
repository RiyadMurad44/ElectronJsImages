<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthRequest;
use App\Services\UserCreationService;
use App\Http\Requests\AuthRequestLogin;

class AuthController extends Controller
{
    public function signup(AuthRequest $request)
    {
        $response = UserCreationService::signup($request->validated());
        // If the signup returned a string (error), treat it as a failure
        if (is_string($response)) {
            return $this->errorMessageResponse(false, [], $response, 400);
        }
        return $this->loginMessageResponse(true, "Signed Up Successfully", $response, 201);
    }

    public function login(AuthRequestLogin $request)
    {
        // $response = UserCreationService::login($request->validated());
        $response = UserCreationService::login($request);
        if (!$response) {
            return $this->errorMessageResponse(false, [], 'Invalid credentials', 400);
        }
        
        return $this->loginMessageResponse(true, "Logged In Successfully", $response, 200);
    }

    public function refresh(AuthRequest $request)
    {
        $response = UserCreationService::refresh($request->validated());
        return $this->loginMessageResponse(true, "Refreshed Successfully", $response, 200);
    }

    public function logout(AuthRequest $request)
    {
        $response = UserCreationService::logout($request->validated());
        return $this->loginMessageResponse(true, "Logged Out Successfully", $response, 200);
    }
}
