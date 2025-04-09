<?php

namespace App\Http\Requests;

use App\Traits\ResponseTrait;
use Illuminate\Foundation\Http\FormRequest;

class AuthRequestLogin extends FormRequest{
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
    public function rules()
    {
        return [
            'email' => 'required|email',
            'password' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            "email.required" => "Your email is required in Login!",
            "password.required" => "Nabiha is needed in Login!",
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
