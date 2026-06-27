package com.productflow.app.users;

import com.productflow.app.common.ApiResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping
    public ApiResponse<List<UserDto>> listUsers() {
        return ApiResponse.ok(List.of(
            new UserDto("usr_ada", "Ada Chen", "ada@example.com", "Owner", "active"),
            new UserDto("usr_ben", "Ben Miller", "ben@example.com", "Admin", "active"),
            new UserDto("usr_chris", "Chris Zhou", "chris@example.com", "Member", "invited")
        ));
    }

    public record UserDto(String id, String name, String email, String role, String status) {
    }
}
