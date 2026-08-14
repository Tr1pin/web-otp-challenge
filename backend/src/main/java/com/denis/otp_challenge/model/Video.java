package com.denis.otp_challenge.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "videos")
public class Video {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Los 11 caracteres del vídeo de YouTube (ej: "dQw4w9WgXcQ").
    // Con esto se saca la miniatura y el enlace sin guardar nada más.
    private String youtubeId;

    private String title;

    private int orderIndex;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "champion_id")
    private Champion champion;
}
