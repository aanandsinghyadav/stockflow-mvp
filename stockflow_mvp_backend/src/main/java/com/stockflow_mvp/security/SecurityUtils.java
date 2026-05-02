package com.stockflow_mvp.security;

import com.stockflow_mvp.entity.User;
import com.stockflow_mvp.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {

    private SecurityUtils() {
        // Utility class — no instantiation
    }

    /**
     * Returns the currently authenticated User from the security context.
     * Throws UnauthorizedException if no authenticated user is present.
     */
    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("No authenticated user found");
        }

        Object principal = authentication.getPrincipal();

        if (!(principal instanceof User user)) {
            throw new UnauthorizedException("Invalid authentication principal");
        }

        return user;
    }

    /**
     * Convenience method — returns just the email of the current user.
     */
    public static String getCurrentUserEmail() {
        return getCurrentUser().getEmail();
    }
}
