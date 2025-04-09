<?php

namespace App\Http\Requests;

use App\Traits\ResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

// use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class AuthRequest extends FormRequest
{
    use ResponseTrait;
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => "required|string|max:255",
            'email' => 'required|email|unique:users,email',
            "password" => [
                "required",
                "string",
                Password::min(8)
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
            "geolocation" => "nullable|array",
            "ip" => "nullable|ip"
            // "terms" => "required|accepted"
        ];
    }

    public function messages(): array
    {
        return [
            "email.required" => "Your email is required!",
            "password.required" => "Nabiha is needed!",
            "terms.required" => "You have to accept the terms and conditions",
            "terms.accepted" => "You have to accepot the terms and conditions"
        ];
    }

    public function attributes(): array
    {
        return [
            "name" => "Full Name",
            "email" => "Email Address"
        ];
    }
}
