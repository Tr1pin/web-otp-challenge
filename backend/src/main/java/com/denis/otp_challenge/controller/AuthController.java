package com.denis.otp_challenge.controller;

import com.denis.otp_challenge.dto.*;
import com.denis.otp_challenge.service.AuthService;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }

        String email = (String) authentication.getPrincipal();
        return ResponseEntity.ok(authService.getCurrentUser(email));
    }
}