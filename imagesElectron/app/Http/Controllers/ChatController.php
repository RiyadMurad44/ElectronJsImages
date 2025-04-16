<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChatRequest;
use App\Services\ChatService;

class ChatController extends Controller
{
    public function getChats()
    {
        $chats = ChatService::getAll();
        $this->messageResponse(true, "Chats fetched", 200, $chats);
    }

    public function storeChat(ChatRequest $request)
    {
        $chat = ChatService::store($request->validated());
        $this->messageResponse(true, "Message Stored", 201, $chat);
    }
}
