package com.productflow.app.audit;

import com.productflow.app.common.ApiResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {
    @GetMapping
    public ApiResponse<List<AuditLogDto>> listAuditLogs() {
        return ApiResponse.ok(List.of(
            new AuditLogDto("log_1", "User invited", "Ada Chen", "auth"),
            new AuditLogDto("log_2", "Role permissions updated", "Ben Miller", "rbac"),
            new AuditLogDto("log_3", "AI prompt published", "System", "ai")
        ));
    }

    public record AuditLogDto(String id, String action, String actor, String scope) {
    }
}
