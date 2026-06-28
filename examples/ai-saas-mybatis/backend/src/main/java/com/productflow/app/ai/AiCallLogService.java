package com.productflow.app.ai;

import com.productflow.app.audit.AuditLogService;
import com.productflow.app.auth.AuthenticatedUser;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AiCallLogService {
    private final JdbcClient jdbc;
    private final AuditLogService auditLogService;

    public AiCallLogService(JdbcClient jdbc, AuditLogService auditLogService) {
        this.jdbc = jdbc;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public void record(AuthenticatedUser actor, String provider, String prompt, String response) {
        jdbc.sql("""
            INSERT INTO ai_calls (user_id, provider, prompt, response, prompt_tokens, completion_tokens)
            VALUES (:userId, :provider, :prompt, :response, :promptTokens, :completionTokens)
            """)
            .param("userId", actor == null ? null : actor.id())
            .param("provider", provider)
            .param("prompt", prompt)
            .param("response", response)
            .param("promptTokens", estimateTokens(prompt))
            .param("completionTokens", estimateTokens(response))
            .update();
        auditLogService.record(actor, "AI chat completed", "ai", "provider=" + provider);
    }

    private int estimateTokens(String value) {
        if (value == null || value.isBlank()) {
            return 0;
        }
        return Math.max(1, value.length() / 4);
    }
}
