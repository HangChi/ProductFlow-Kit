package com.productflow.app.users;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.time.Instant;

@TableName("app_users")
public record UserRecord(
    @TableId Long id,
    String name,
    String email,
    String status,
    Instant createdAt
) {
}
