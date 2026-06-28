package com.productflow.app.ai;

import com.productflow.app.common.ApiResponse;
import java.time.Instant;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.productflow.app.auth.AuthenticatedUser;
import org.springframework.security.core.Authentication;


@RestController
@RequestMapping("/api/ai")
public class AiChatController {
    private final AiProvider aiProvider;
    private final AiCallLogService aiCallLogService;
    private final com.productflow.app.roles.PermissionGuard permissionGuard;


    public AiChatController(AiProvider aiProvider, AiCallLogService aiCallLogService, com.productflow.app.roles.PermissionGuard permissionGuard) {
        this.aiProvider = aiProvider;
        this.aiCallLogService = aiCallLogService;
        this.permissionGuard = permissionGuard;

    }

    @PostMapping("/chat")
    public ApiResponse<ChatResponse> chat(@Valid @RequestBody ChatRequest request, Authentication authentication) {
        permissionGuard.require("ai:use");
        String response = aiProvider.complete(request.message());
        aiCallLogService.record(actor(authentication), "mock", request.message(), response);
        return ApiResponse.ok(new ChatResponse(response, Instant.now().toString()));
    }

    public record ChatRequest(String message) {
    }

    public record ChatResponse(String message, String createdAt) {
    }

    private AuthenticatedUser actor(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof AuthenticatedUser user) {
            return user;
        }
        return null;
    }

}
