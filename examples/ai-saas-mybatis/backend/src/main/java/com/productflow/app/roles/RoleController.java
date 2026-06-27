package com.productflow.app.roles;

import com.productflow.app.common.ApiResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/roles")
public class RoleController {
    @GetMapping
    public ApiResponse<List<RoleDto>> listRoles() {
        return ApiResponse.ok(List.of(
            new RoleDto("owner", "Owner", "Full workspace and billing access"),
            new RoleDto("admin", "Admin", "Manage users, roles, and operations"),
            new RoleDto("member", "Member", "Use product workflows and AI tools")
        ));
    }

    public record RoleDto(String key, String name, String description) {
    }
}
