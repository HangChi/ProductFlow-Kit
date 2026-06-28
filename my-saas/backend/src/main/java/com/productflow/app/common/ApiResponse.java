package com.productflow.app.common;

public record ApiResponse<T>(boolean success, T data, String message) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null);
    }

    public static <T> ApiResponse<T> message(String message) {
        return new ApiResponse<>(true, null, message);
    }
}
