<?php

namespace App\Services;

use App\Models\Chat;
use Illuminate\Support\Facades\Auth;

class ChatService
{
    /**
     * Create a new class instance.
     */
    public static function store($validated)
    {
        $chat = new Chat();
        $chat->user_id = Auth::id();
        $chat->message = $validated['message'];
        $chat->save();

        return $chat;
    }

    public static function getAll()
    {
        return Chat::with('user:id,name')->latest()->get();
    }
}
