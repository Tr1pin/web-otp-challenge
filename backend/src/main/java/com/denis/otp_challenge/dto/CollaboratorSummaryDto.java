package com.denis.otp_challenge.dto;

import com.denis.otp_challenge.model.Collaborator;

public record CollaboratorSummaryDto(
        Long id,
        String name,
        String photoUrl
) {
    public static CollaboratorSummaryDto from(Collaborator c) {
        if (c == null) return null;
        return new CollaboratorSummaryDto(c.getId(), c.getName(), c.getPhotoUrl());
    }
}