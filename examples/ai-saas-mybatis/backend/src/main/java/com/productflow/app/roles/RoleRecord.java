package com.productflow.app.roles;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

@TableName("roles")
public record RoleRecord(
    @TableId Long id,
    String key,
    String name
) {
}
