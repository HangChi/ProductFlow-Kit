package com.productflow.app.roles;

import com.productflow.app.common.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;


@RestController
@RequestMapping("/api/roles")
public class RoleController {
    private final RoleService roleService;
    private final PermissionService permissionService;
    private final PermissionGuard permissionGuard;

    public RoleController(RoleService roleService, PermissionService permissionService, PermissionGuard permissionGuard) {
        this.roleService = roleService;
        this.permissionService = permissionService;
        this.permissionGuard = permissionGuard;
    }

    @GetMapping
    public ApiResponse<List<RoleService.RoleDto>> listRoles() {
        permissionGuard.require("roles:read");
        return ApiResponse.ok(roleService.listRoles());
    }

    @PostMapping
    public ApiResponse<RoleService.RoleDto> createRole(@Valid @RequestBody RoleService.SaveRoleRequest request, Authentication authentication) {
        permissionGuard.require("roles:write");
        return ApiResponse.ok(roleService.createRole(request));
    }

    @PutMapping("/{roleKey}")
    public ApiResponse<RoleService.RoleDto> updateRole(
        @PathVariable String roleKey,
        @Valid @RequestBody RoleService.SaveRoleRequest request, Authentication authentication
    ) {
        permissionGuard.require("roles:write");
        return ApiResponse.ok(roleService.updateRole(roleKey, request));
    }

    @GetMapping("/permissions")
    public ApiResponse<List<PermissionService.PermissionDto>> listPermissions() {
        permissionGuard.require("roles:read");
        return ApiResponse.ok(permissionService.listPermissions());
    }

    @GetMapping("/menu")
    public ApiResponse<List<PermissionService.MenuItemDto>> listMenu() {
        return ApiResponse.ok(permissionService.listMenu());
    }
}
