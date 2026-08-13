package com.denis.otp_challenge.dto;

import com.denis.otp_challenge.model.Collaborator;
import java.util.List;

public record CollaboratorDto(
        Long id,
        String name,
        String photoUrl,
        String bio,
        List<CollaboratorSocialDto> socials
) {
    public static CollaboratorDto from(Collaborator c) {
        List<CollaboratorSocialDto> socials = c.getSocials() == null ? List.of()
                : c.getSocials().stream().map(CollaboratorSocialDto::from).toList();
        return new CollaboratorDto(c.getId(), c.getName(), c.getPhotoUrl(), c.getBio(), socials);
    }
}