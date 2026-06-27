package com.productflow.app.auth;

import com.productflow.app.common.ApiResponse;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> login(@RequestBody LoginRequest request) {
        return ApiResponse.ok(Map.of(
            "token", "dev-token",
            "email", request.email(),
            "expiresIn", 3600
        ));
    }

    @GetMapping("/me")
    public ApiResponse<Map<String, Object>> me() {
        return ApiResponse.ok(Map.of(
            "id", "usr_demo",
            "name", "Ada Chen",
            "email", "ada@example.com",
            "role", "Owner"
        ));
    }

    public record LoginRequest(String email, String password) {
    }
}
