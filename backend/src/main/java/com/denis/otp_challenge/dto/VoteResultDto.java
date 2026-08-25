package com.denis.otp_challenge.dto;

public record VoteResultDto(
        boolean voted,
        int voteCount,
        Long championId,
        String championName
) {}