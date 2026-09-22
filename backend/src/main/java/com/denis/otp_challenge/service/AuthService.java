package com.denis.otp_challenge.service;

import com.denis.otp_challenge.dto.*;
import com.denis.otp_challenge.model.User;
import com.denis.otp_challenge.model.enums.AuthProvider;
import com.denis.otp_challenge.model.enums.Role;
import com.denis.otp_challenge.repository.UserRepository;
import com.denis.otp_challenge.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

// Login local desactivado por seguridad — solo Google.
//    public AuthResponse register(RegisterRequest request) {
//
//        if (userRepository.existsByEmail(request.email())) {
//            throw new ResponseStatusException(HttpStatus.CONFLICT, "El email ya está registrado");
//        }
//
//        User user = new User();
//        user.setEmail(request.email());
//        user.setPasswordHash(passwordEncoder.encode(request.password()));
//        user.setDisplayName(request.displayName());
//        user.setRole(Role.USER);
//        user.setProvider(AuthProvider.LOCAL);
//
//        User saved = userRepository.save(user);
//        String token = jwtService.generateToken(saved.getEmail());
//        return new AuthResponse(token, UserDto.from(saved));
//    }
//
//
//    public AuthResponse login(LoginRequest request) {
//
//        User user = userRepository.findByEmail(request.email())
//                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));
//
//        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
//        }
//
//        String token = jwtService.generateToken(user.getEmail());
//        return new AuthResponse(token, UserDto.from(user));
//    }


    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return UserDto.from(user);
    }
}