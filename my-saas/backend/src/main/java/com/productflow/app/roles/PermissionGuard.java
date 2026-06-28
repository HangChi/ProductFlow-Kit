package com.productflow.app.roles;

import com.productflow.app.auth.AuthenticatedUser;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PermissionGuard {
    private final PermissionService permissionService;

    public PermissionGuard(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    public void require(String permission) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        if (!permissionService.userHasPermission(user.id(), permission)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Missing permission: " + permission);
        }
    }
}
