package com.productflow.app.auth;

import com.productflow.app.audit.AuditLogService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final JdbcClient jdbc;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogService auditLogService;

    public AuthService(JdbcClient jdbc, PasswordEncoder passwordEncoder, AuditLogService auditLogService) {
        this.jdbc = jdbc;
        this.passwordEncoder = passwordEncoder;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public SessionResponse register(RegisterRequest request) {
        if (findByEmail(request.email()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        Long userId = jdbc.sql("""
            INSERT INTO app_users (name, email, password_hash, role_key, status)
            VALUES (:name, :email, :passwordHash, 'member', 'active')
            RETURNING id
            """)
            .param("name", request.name())
            .param("email", request.email().toLowerCase(Locale.ROOT))
            .param("passwordHash", passwordEncoder.encode(request.password()))
            .query(Long.class)
            .single();

        AuthenticatedUser user = findUserById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User was not created"));
        auditLogService.record(user, "User registered", "auth", "email=" + user.email());
        return createSession(user);
    }

    @Transactional
    public SessionResponse login(LoginRequest request) {
        UserWithPassword user = findByEmail(request.email())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.passwordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        if (!"active".equalsIgnoreCase(user.status())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not active");
        }

        AuthenticatedUser authenticatedUser = new AuthenticatedUser(
            user.id(),
            user.name(),
            user.email(),
            user.roleKey(),
            user.status()
        );
        auditLogService.record(authenticatedUser, "User logged in", "auth", "email=" + user.email());
        return createSession(authenticatedUser);
    }

    @Transactional
    public void logout(String token) {
        jdbc.sql("""
            UPDATE auth_sessions
            SET revoked_at = NOW()
            WHERE token = :token AND revoked_at IS NULL
            """)
            .param("token", token)
            .update();
    }

    public Optional<AuthenticatedUser> findUserByToken(String token) {
        return jdbc.sql("""
            SELECT u.id, u.name, u.email, u.role_key AS roleKey, u.status
            FROM auth_sessions s
            JOIN app_users u ON u.id = s.user_id
            WHERE s.token = :token
              AND s.revoked_at IS NULL
              AND s.expires_at > NOW()
              AND u.status = 'active'
            """)
            .param("token", token)
            .query(AuthenticatedUser.class)
            .optional();
    }

    public List<GrantedAuthority> authoritiesFor(AuthenticatedUser user) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.roleKey().toUpperCase(Locale.ROOT)));
        jdbc.sql("""
            SELECT permission_key
            FROM role_permissions
            WHERE role_key = :roleKey
            """)
            .param("roleKey", user.roleKey())
            .query(String.class)
            .list()
            .forEach(permission -> authorities.add(new SimpleGrantedAuthority(permission)));
        return authorities;
    }


    private SessionResponse createSession(AuthenticatedUser user) {
        String token = UUID.randomUUID().toString().replace("-", "");
        Instant expiresAt = Instant.now().plus(Duration.ofHours(8));

        jdbc.sql("""
            INSERT INTO auth_sessions (token, user_id, expires_at)
            VALUES (:token, :userId, :expiresAt)
            """)
            .param("token", token)
            .param("userId", user.id())
            .param("expiresAt", expiresAt)
            .update();

        return new SessionResponse(token, user, expiresAt);
    }

    private Optional<UserWithPassword> findByEmail(String email) {
        return jdbc.sql("""
            SELECT id, name, email, role_key AS roleKey, status, password_hash AS passwordHash
            FROM app_users
            WHERE lower(email) = lower(:email)
            """)
            .param("email", email)
            .query(UserWithPassword.class)
            .optional();
    }

    private Optional<AuthenticatedUser> findUserById(Long id) {
        return jdbc.sql("""
            SELECT id, name, email, role_key AS roleKey, status
            FROM app_users
            WHERE id = :id
            """)
            .param("id", id)
            .query(AuthenticatedUser.class)
            .optional();
    }

    public record RegisterRequest(
        @NotBlank String name,
        @Email @NotBlank String email,
        @NotBlank String password
    ) {
    }

    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {
    }

    public record SessionResponse(String token, AuthenticatedUser user, Instant expiresAt) {
    }

    private record UserWithPassword(
        Long id,
        String name,
        String email,
        String roleKey,
        String status,
        String passwordHash
    ) {
    }
}
