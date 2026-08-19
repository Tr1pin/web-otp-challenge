package com.denis.otp_challenge.dto;

public record LoginRequest(
        String email,
        String password
) {}