package com.denis.otp_challenge.dto;

public record RegisterRequest(
        String email,
        String password,
        String displayName
) {}