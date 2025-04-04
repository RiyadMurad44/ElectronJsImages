<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::group(["prefix" => "v1"], function() {
    //Authenticated Users
    Route::group(["middleware" => "auth:api"], function() {

    });

    //Unauthenticated Users
    Route::post("/login", [AuthController::class, "login"])->name("login");
    Route::post("/signup", [AuthController::class, "signup"])->name("signup");
});


