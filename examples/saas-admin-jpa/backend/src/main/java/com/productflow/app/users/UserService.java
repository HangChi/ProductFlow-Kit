package com.productflow.app.users;

import com.productflow.app.audit.AuditLogService;
import com.productflow.app.auth.AuthenticatedUser;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {
    private final JdbcClient jdbc;
    private final AuditLogService auditLogService;
    private final PasswordEncoder passwordEncoder;


    public UserService(JdbcClient jdbc, AuditLogService auditLogService, PasswordEncoder passwordEncoder) {
        this.jdbc = jdbc;
        this.auditLogService = auditLogService;
        this.passwordEncoder = passwordEncoder;

    }

    public List<UserDto> listUsers() {
        return jdbc.sql("""
            SELECT id, name, email, role_key AS roleKey, status, created_at AS createdAt
            FROM app_users
            ORDER BY created_at DESC
            """)
            .query(UserDto.class)
            .list();
    }

    @Transactional
    public UserDto createUser(CreateUserRequest request, AuthenticatedUser actor) {
        String passwordHash = passwordEncoder.encode(request.password() == null || request.password().isBlank() ? "password" : request.password());
        Long id = jdbc.sql("""
            INSERT INTO app_users (name, email, password_hash, role_key, status)
            VALUES (:name, :email, :passwordHash, :roleKey, :status)
            RETURNING id
            """)
            .param("name", request.name())
            .param("email", request.email().toLowerCase(Locale.ROOT))
            .param("passwordHash", passwordHash)
            .param("roleKey", normalizeRole(request.roleKey()))
            .param("status", request.status() == null || request.status().isBlank() ? "active" : request.status())
            .query(Long.class)
            .single();

        UserDto user = getUser(id);
        auditLogService.record(actor, "User created", "users", "userId=" + user.id());
        return user;
    }

    @Transactional
    public UserDto updateUser(Long id, UpdateUserRequest request, AuthenticatedUser actor) {
        UserDto existing = getUser(id);
        jdbc.sql("""
            UPDATE app_users
            SET name = :name,
                role_key = :roleKey,
                status = :status,
                updated_at = NOW()
            WHERE id = :id
            """)
            .param("id", id)
            .param("name", request.name() == null || request.name().isBlank() ? existing.name() : request.name())
            .param("roleKey", request.roleKey() == null || request.roleKey().isBlank() ? existing.roleKey() : normalizeRole(request.roleKey()))
            .param("status", request.status() == null || request.status().isBlank() ? existing.status() : request.status())
            .update();

        UserDto user = getUser(id);
        auditLogService.record(actor, "User updated", "users", "userId=" + user.id());
        return user;
    }

    @Transactional
    public void disableUser(Long id, AuthenticatedUser actor) {
        getUser(id);
        jdbc.sql("""
            UPDATE app_users
            SET status = 'disabled', updated_at = NOW()
            WHERE id = :id
            """)
            .param("id", id)
            .update();
        auditLogService.record(actor, "User disabled", "users", "userId=" + id);
    }

    private UserDto getUser(Long id) {
        return jdbc.sql("""
            SELECT id, name, email, role_key AS roleKey, status, created_at AS createdAt
            FROM app_users
            WHERE id = :id
            """)
            .param("id", id)
            .query(UserDto.class)
            .optional()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private String normalizeRole(String roleKey) {
        return roleKey == null || roleKey.isBlank() ? "member" : roleKey.toLowerCase(Locale.ROOT);
    }

    public record UserDto(Long id, String name, String email, String roleKey, String status, Instant createdAt) {
    }

    public record CreateUserRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        String password,
        String roleKey,
        String status
    ) {
    }

    public record UpdateUserRequest(String name, String roleKey, String status) {
    }
}
