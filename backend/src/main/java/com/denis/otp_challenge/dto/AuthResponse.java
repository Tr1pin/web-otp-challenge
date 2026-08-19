package com.denis.otp_challenge.dto;

public record AuthResponse(
        String token,
        UserDto user
) {}