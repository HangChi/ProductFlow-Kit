package com.productflow.app.audit;

import com.productflow.app.common.ApiResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {
    private final AuditLogService auditLogService;
    private final com.productflow.app.roles.PermissionGuard permissionGuard;


    public AuditLogController(AuditLogService auditLogService, com.productflow.app.roles.PermissionGuard permissionGuard) {
        this.auditLogService = auditLogService;
        this.permissionGuard = permissionGuard;

    }

    @GetMapping
    public ApiResponse<List<AuditLogService.AuditLogDto>> listAuditLogs() {
        permissionGuard.require("audit:read");
        return ApiResponse.ok(auditLogService.listLogs());
    }
}
