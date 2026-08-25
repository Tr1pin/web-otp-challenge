package com.denis.otp_challenge.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "votes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id"})
})
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "champion_id")
    private Champion champion;

    // auto generar la hora/minuto del voto.
    @CreationTimestamp
    private LocalDateTime createdAt;

}
