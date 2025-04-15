<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\User;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Tests\TestCase;

class loginSignupTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use WithFaker;

    public function testLoginUser(): void
    {
        $user = User::factory()->create(); // Assuming you have a User factory
        $credentials = [
            'email' => $user->email,
            'password' => 'password' // Assuming 'password' is used in the factory
        ];

        $response = $this->postJson('http://localhost:8000/api/v1/login', $credentials);

        $response->assertStatus(200)
            ->assertJsonStructure([
                "success",
                "message",
                "data" => [
                    "token",
                    "name",
                    "email",
                    "ip",
                    "geolocation"
                ]
            ])
            ->assertJson([
                "success" => true,
                "message" => "Logged In Successfully"
            ]);
    }

    public function testSignupUser(): void
    {
        // Create a base user for authentication
        $user = User::factory()->create();
        $token = JWTAuth::fromUser($user); // Generate a token for the base user

        // Prepare geolocation data and other necessary attributes
        $geolocation = [
            'latitude' => $this->faker->latitude(),
            'longitude' => $this->faker->longitude(),
        ];

        // Generate name dynamically using Faker
        $name = $this->faker->name();

        $response = $this->withHeaders([
            "Authorization" => "Bearer $token", // Use the base user's token
        ])->postJson("http://localhost:8000/api/v1/signup", [
            "name" => $name,  // Name now taken from Faker
            "email" => $this->faker->unique()->safeEmail(),
            "password" => "Pa#sword1",
            "ip" => $this->faker->ipv4(),
            "geolocation" => $geolocation
        ]);

        $response->assertStatus(201)
            ->assertJson([
                "success" => true,
                "message" => "Signed Up Successfully",
                "data" => [
                    "name" => $name,
                    "email" => $response->json('data.email'),
                    "ip" => $response->json('data.ip'),
                    "geolocation" => $response->json('data.geolocation'),
                    "token" => $response->json('data.token'),
                ]
            ]);
    }

    public function testInvalidLogin(): void
    {
        $credentials = [
            'email' => 'nonexistentuser@example.com',
            'password' => 'wrongpassword'
        ];

        $response = $this->postJson('http://localhost:8000/api/v1/login', $credentials);

        $response->assertStatus(400)
            ->assertJson([
                "success" => false,
                "message" => "Invalid credentials"
            ]);
    }

    public function testSignupUserWithMissingFields(): void
    {
        $response = $this->postJson('http://localhost:8000/api/v1/signup', [
            "name" => $this->faker->name(),  // Name dynamically generated
            "password" => "password",
            "ip" => $this->faker->ipv4(),
            "geolocation" => [
                'latitude' => $this->faker->latitude(),
                'longitude' => $this->faker->longitude(),
            ]
            // Missing email
        ]);

        $response->assertStatus(422)  // Validation error status
            ->assertJsonValidationErrors(['email']);
    }

    public function testSignupWithInvalidEmailFormat(): void
    {
        $response = $this->postJson('http://localhost:8000/api/v1/signup', [
            "name" => $this->faker->name(),  // Name dynamically generated
            "email" => "invalidemail",  // Invalid email format
            "password" => "Pa#sword1",
            "ip" => $this->faker->ipv4(),
            "geolocation" => [
                'latitude' => $this->faker->latitude(),
                'longitude' => $this->faker->longitude(),
            ]
        ]);

        $response->assertStatus(422)  // Validation error status
            ->assertJsonValidationErrors(['email']);
    }
}
