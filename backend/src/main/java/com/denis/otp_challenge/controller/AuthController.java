package com.denis.otp_challenge.controller;

import com.denis.otp_challenge.dto.*;
import com.denis.otp_challenge.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseCookie;
import org.springframework.http.HttpHeaders;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Login local desactivado por seguridad — solo Google.
//    @PostMapping("/register")
//    public AuthResponse register(@RequestBody RegisterRequest request,
//                                 HttpServletResponse response) {
//        AuthResponse auth = authService.register(request);
//        addTokenCookie(response, auth.token());
//        return auth;
//    }
//
//    @PostMapping("/login")
//    public AuthResponse login(@RequestBody LoginRequest request,
//                              HttpServletResponse response) {
//        AuthResponse auth = authService.login(request);
//        addTokenCookie(response, auth.token());
//        return auth;
//    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        String email = (String) authentication.getPrincipal();
        return ResponseEntity.ok(authService.getCurrentUser(email));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok().build();
    }

    private void addTokenCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(24 * 60 * 60)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    @GetMapping("/oauth-start")
    public void oauthStart(@RequestParam(defaultValue = "public") String origin,
                           HttpServletResponse response) throws IOException {
        ResponseCookie cookie = ResponseCookie.from("oauth_origin", origin)
                .httpOnly(true).secure(true).sameSite("None").path("/").maxAge(300).build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        response.sendRedirect("/oauth2/authorization/google");
    }
}