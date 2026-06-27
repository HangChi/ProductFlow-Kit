package com.productflow.app.ai;

import org.springframework.stereotype.Component;

@Component
public class MockAiProvider implements AiProvider {
    @Override
    public String complete(String message) {
        return "Mock AI response for: " + message;
    }
}
