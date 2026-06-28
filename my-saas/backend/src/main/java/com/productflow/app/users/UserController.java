package com.productflow.app.users;

import com.productflow.app.common.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.productflow.app.auth.AuthenticatedUser;
import org.springframework.security.core.Authentication;
import com.productflow.app.roles.PermissionGuard;


@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final PermissionGuard permissionGuard;


    public UserController(UserService userService, PermissionGuard permissionGuard) {
        this.userService = userService;
        this.permissionGuard = permissionGuard;

    }

    @GetMapping
    public ApiResponse<List<UserService.UserDto>> listUsers() {
        permissionGuard.require("users:read");
        return ApiResponse.ok(userService.listUsers());
    }

    @PostMapping
    public ApiResponse<UserService.UserDto> createUser(
        @Valid @RequestBody UserService.CreateUserRequest request, Authentication authentication
    ) {
        permissionGuard.require("users:write");
        return ApiResponse.ok(userService.createUser(request, actor(authentication)));
    }

    @PutMapping("/{id}")
    public ApiResponse<UserService.UserDto> updateUser(
        @PathVariable Long id,
        @Valid @RequestBody UserService.UpdateUserRequest request, Authentication authentication
    ) {
        permissionGuard.require("users:write");
        return ApiResponse.ok(userService.updateUser(id, request, actor(authentication)));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable Long id, Authentication authentication) {
        permissionGuard.require("users:write");
        userService.disableUser(id, actor(authentication));
        return ApiResponse.ok(null);
    }

    private AuthenticatedUser actor(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof AuthenticatedUser user) {
            return user;
        }
        return null;
    }

}
