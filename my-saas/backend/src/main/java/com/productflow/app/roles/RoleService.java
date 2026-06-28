package com.productflow.app.roles;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class RoleService {
    private final JdbcClient jdbc;

    public RoleService(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public List<RoleDto> listRoles() {
        return jdbc.sql("""
            SELECT r.role_key AS roleKey,
                   r.name,
                   r.description,
                   COUNT(u.id) AS memberCount
            FROM roles r
            LEFT JOIN app_users u ON u.role_key = r.role_key AND u.status <> 'disabled'
            GROUP BY r.role_key, r.name, r.description
            ORDER BY r.role_key
            """)
            .query(RoleDto.class)
            .list();
    }

    @Transactional
    public RoleDto createRole(SaveRoleRequest request) {
        String roleKey = normalize(request.roleKey());
        jdbc.sql("""
            INSERT INTO roles (role_key, name, description)
            VALUES (:roleKey, :name, :description)
            """)
            .param("roleKey", roleKey)
            .param("name", request.name())
            .param("description", request.description())
            .update();

        replacePermissions(roleKey, request.permissions());
        return getRole(roleKey);
    }

    @Transactional
    public RoleDto updateRole(String roleKey, SaveRoleRequest request) {
        String normalized = normalize(roleKey);
        jdbc.sql("""
            UPDATE roles
            SET name = :name,
                description = :description
            WHERE role_key = :roleKey
            """)
            .param("roleKey", normalized)
            .param("name", request.name())
            .param("description", request.description())
            .update();

        replacePermissions(normalized, request.permissions());
        return getRole(normalized);
    }

    private RoleDto getRole(String roleKey) {
        return jdbc.sql("""
            SELECT r.role_key AS roleKey,
                   r.name,
                   r.description,
                   COUNT(u.id) AS memberCount
            FROM roles r
            LEFT JOIN app_users u ON u.role_key = r.role_key AND u.status <> 'disabled'
            WHERE r.role_key = :roleKey
            GROUP BY r.role_key, r.name, r.description
            """)
            .param("roleKey", roleKey)
            .query(RoleDto.class)
            .optional()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Role not found"));
    }

    private void replacePermissions(String roleKey, List<String> permissions) {
        jdbc.sql("DELETE FROM role_permissions WHERE role_key = :roleKey")
            .param("roleKey", roleKey)
            .update();

        if (permissions == null) {
            return;
        }

        for (String permission : permissions) {
            jdbc.sql("""
                INSERT INTO role_permissions (role_key, permission_key)
                VALUES (:roleKey, :permission)
                ON CONFLICT DO NOTHING
                """)
                .param("roleKey", roleKey)
                .param("permission", permission)
                .update();
        }
    }

    private String normalize(String roleKey) {
        if (roleKey == null || roleKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role key is required");
        }
        return roleKey.toLowerCase(Locale.ROOT);
    }

    public record RoleDto(String roleKey, String name, String description, long memberCount) {
    }

    public record SaveRoleRequest(
        @NotBlank String roleKey,
        @NotBlank String name,
        String description,
        List<String> permissions
    ) {
    }
}
