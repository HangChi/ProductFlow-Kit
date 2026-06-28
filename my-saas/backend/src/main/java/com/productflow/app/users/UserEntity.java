package com.productflow.app.users;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "app_users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "role_key", nullable = false)
    private String roleKey = "member";

    @Column(nullable = false)
    private String status = "active";

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    private Instant updatedAt;

    public Long getId() {
        return id;
    }
}
