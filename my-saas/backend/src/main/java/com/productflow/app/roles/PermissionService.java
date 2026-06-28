package com.productflow.app.roles;

import java.util.List;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

@Service
public class PermissionService {
    private final JdbcClient jdbc;

    public PermissionService(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public List<PermissionDto> listPermissions() {
        return jdbc.sql("""
            SELECT permission_key AS permissionKey, name, description
            FROM permissions
            ORDER BY permission_key
            """)
            .query(PermissionDto.class)
            .list();
    }

    public List<MenuItemDto> listMenu() {
        return List.of(
            new MenuItemDto("dashboard", "Dashboard", "/", "dashboard:view"),
            new MenuItemDto("users", "Users", "/users", "users:read"),
            new MenuItemDto("roles", "Roles", "/roles", "roles:read"),
            new MenuItemDto("ai", "AI Chat", "/ai", "ai:use"),
            new MenuItemDto("files", "Files", "/files", "files:write"),
            new MenuItemDto("email", "Email", "/email", "email:send"),
            new MenuItemDto("audit", "Audit Logs", "/audit", "audit:read"),
            new MenuItemDto("settings", "Settings", "/settings", "settings:write")
        );
    }

    public boolean userHasPermission(Long userId, String permission) {
        Long count = jdbc.sql("""
            SELECT COUNT(*)
            FROM app_users u
            JOIN role_permissions rp ON rp.role_key = u.role_key
            WHERE u.id = :userId AND rp.permission_key = :permission
            """)
            .param("userId", userId)
            .param("permission", permission)
            .query(Long.class)
            .single();
        return count != null && count > 0;
    }

    public record PermissionDto(String permissionKey, String name, String description) {
    }

    public record MenuItemDto(String key, String label, String path, String permission) {
    }
}
