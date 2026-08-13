package com.denis.otp_challenge.dto;

import com.denis.otp_challenge.model.User;
import com.denis.otp_challenge.model.enums.Role;

public record UserDto(
        Long id,
        String email,
        String displayName,
        Role role
) {
    public static UserDto from(User u) {
        return new UserDto(u.getId(), u.getEmail(), u.getDisplayName(), u.getRole());
    }
}