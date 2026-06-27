package com.productflow.app.ai;

import com.productflow.app.common.ApiResponse;
import java.time.Instant;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiChatController {
    private final AiProvider aiProvider;

    public AiChatController(AiProvider aiProvider) {
        this.aiProvider = aiProvider;
    }

    @PostMapping("/chat")
    public ApiResponse<ChatResponse> chat(@RequestBody ChatRequest request) {
        return ApiResponse.ok(new ChatResponse(aiProvider.complete(request.message()), Instant.now().toString()));
    }

    public record ChatRequest(String message) {
    }

    public record ChatResponse(String message, String createdAt) {
    }
}
