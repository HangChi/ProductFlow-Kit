package com.productflow.app.auth;

public record AuthenticatedUser(Long id, String name, String email, String roleKey, String status) {
    public boolean isActive() {
        return "active".equalsIgnoreCase(status);
    }
}
