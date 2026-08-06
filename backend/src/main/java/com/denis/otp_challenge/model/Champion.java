package com.denis.otp_challenge.model;

import com.denis.otp_challenge.model.enums.ChampionStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Entity
public class Champion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String champion_key;
    private String photoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collaborator_id")
    private Collaborator collaborator;

    @Column(precision = 4, scale = 2)
    private BigDecimal winRatio;

    private int wins;
    private int losses;

    private String notes;

    private int order_index;
    private int vote_count;

    @Enumerated(EnumType.STRING)
    private ChampionStatus status;

}
