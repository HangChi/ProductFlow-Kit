package com.productflow.app.audit;

import com.productflow.app.auth.AuthenticatedUser;
import java.time.Instant;
import java.util.List;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogService {
    private final JdbcClient jdbc;

    public AuditLogService(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    public List<AuditLogDto> listLogs() {
        return jdbc.sql("""
            SELECT id,
                   actor_email AS actorEmail,
                   action,
                   scope,
                   metadata,
                   created_at AS createdAt
            FROM audit_logs
            ORDER BY created_at DESC
            LIMIT 100
            """)
            .query(AuditLogDto.class)
            .list();
    }

    @Transactional
    public void record(AuthenticatedUser actor, String action, String scope, String metadata) {
        jdbc.sql("""
            INSERT INTO audit_logs (actor_user_id, actor_email, action, scope, metadata)
            VALUES (:actorUserId, :actorEmail, :action, :scope, :metadata)
            """)
            .param("actorUserId", actor == null ? null : actor.id())
            .param("actorEmail", actor == null ? "system" : actor.email())
            .param("action", action)
            .param("scope", scope)
            .param("metadata", metadata)
            .update();
    }

    public record AuditLogDto(
        Long id,
        String actorEmail,
        String action,
        String scope,
        String metadata,
        Instant createdAt
    ) {
    }
}
