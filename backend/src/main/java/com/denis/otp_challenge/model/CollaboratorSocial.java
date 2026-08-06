package com.denis.otp_challenge.model;

import com.denis.otp_challenge.model.enums.SocialPlatform;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class CollaboratorSocial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collaborator_id")
    private Collaborator collaborator;

    @Enumerated(EnumType.STRING)
    private SocialPlatform platform;

    private String url;

}
