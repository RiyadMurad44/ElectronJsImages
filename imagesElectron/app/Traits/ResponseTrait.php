<?php

namespace App\Traits;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

trait ResponseTrait
{
    function loginMessageResponse($success, $message, $response, $statusCode)
    {
        return response()->json([
            "success" => $success,
            "message" => $message,
            "data" => $response
        ], $statusCode);
    }

    function messageResponse($success, $message, $statusCode, $data = null)
    {
        return response()->json([
            "success" => $success,
            "message" => $message,
            "data" => $data
        ], $statusCode);
    }

    function errorMessageResponse($success, $error, $message, $statusCode)
    {
        return response()->json([
            "success" => $success,
            "error" => $error,
            "message" => $message
        ], $statusCode);
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'errors' => $validator->errors(),
            'message' => 'Invalid Credentials'
        ], 422));
    }
}
