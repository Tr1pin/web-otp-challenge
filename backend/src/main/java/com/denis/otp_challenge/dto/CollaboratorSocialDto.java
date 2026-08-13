package com.denis.otp_challenge.dto;

import com.denis.otp_challenge.model.CollaboratorSocial;
import com.denis.otp_challenge.model.enums.SocialPlatform;

public record CollaboratorSocialDto(
        Long id,
        SocialPlatform platform,
        String url
) {
    public static CollaboratorSocialDto from(CollaboratorSocial s) {
        return new CollaboratorSocialDto(s.getId(), s.getPlatform(), s.getUrl());
    }
}