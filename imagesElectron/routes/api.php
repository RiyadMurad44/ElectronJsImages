<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;

Route::group(["prefix" => "v1"], function () {
    //Authenticated Users
    Route::group(["middleware" => "auth:api"], function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/chats', [ChatController::class, 'getChats']);
        Route::post('/chats', [ChatController::class, 'storeChat']);
    });

    //Unauthenticated Users
    Route::post("/login", [AuthController::class, "login"])->name("login");
    Route::post("/signup", [AuthController::class, "signup"])->name("signup");
});
