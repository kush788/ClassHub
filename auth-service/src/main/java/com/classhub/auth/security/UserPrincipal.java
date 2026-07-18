package com.classhub.auth.security;

import com.classhub.auth.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class UserPrincipal implements UserDetails {

    private final User user;

    public UserPrincipal(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );

    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    /**
     * Username for authentication.
     * We are using email instead of username.
     */
    @Override
    public String getUsername() {
        return user.getEmail();
    }

    /**
     * Account never expires.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Account never locked.
     */
    @Override
    public boolean isAccountNonLocked() {
        return !user.isAccountLocked();
    }

    /**
     * Credentials never expire.
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * User must verify email before login.
     */
    @Override
    public boolean isEnabled() {
        return user.isEnabled() && user.isEmailVerified();
    }
}