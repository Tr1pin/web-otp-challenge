package com.denis.otp_challenge.dto;

import com.denis.otp_challenge.model.Champion;
import com.denis.otp_challenge.model.enums.ChampionStatus;
import java.math.BigDecimal;

public record ChampionDto(
        Long id,
        String name,
        String championKey,
        String photoUrl,
        BigDecimal winRatio,
        int wins,
        int losses,
        String notes,
        int orderIndex,
        ChampionStatus status,
        int voteCount,
        CollaboratorSummaryDto collaborator
) {
    public static ChampionDto from(Champion c) {
        return new ChampionDto(
                c.getId(),
                c.getName(),
                c.getChampionKey(),
                c.getPhotoUrl(),
                c.getWinRatio(),
                c.getWins(),
                c.getLosses(),
                c.getNotes(),
                c.getOrderIndex(),
                c.getStatus(),
                c.getVoteCount(),
                CollaboratorSummaryDto.from(c.getCollaborator())
        );
    }
}