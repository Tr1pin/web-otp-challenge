package com.denis.otp_challenge.model;

import com.denis.otp_challenge.model.enums.AuthProvider;
import com.denis.otp_challenge.model.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email
    private String email;

    private String passwordHash;

    private String displayName;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    private String providerId;

}
