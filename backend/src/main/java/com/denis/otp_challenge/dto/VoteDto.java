package com.denis.otp_challenge.dto;

import com.denis.otp_challenge.model.Vote;

import java.time.LocalDateTime;

public record VoteDto(
        Long id,
        Long userId,
        Long championId,
        LocalDateTime createdAt
) {
    public static VoteDto from(Vote v) {
        return new VoteDto(
                v.getId(),
                v.getUser() != null ? v.getUser().getId() : null,
                v.getChampion() != null ? v.getChampion().getId() : null,
                v.getCreatedAt()
        );
    }
}