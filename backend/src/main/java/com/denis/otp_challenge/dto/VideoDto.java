package com.denis.otp_challenge.dto;

import com.denis.otp_challenge.model.Video;

public record VideoDto(
        Long id,
        String youtubeId,
        String title,
        int orderIndex,
        String thumbnailUrl,   // miniatura derivada del youtubeId
        String watchUrl        // enlace al vídeo derivado del youtubeId
) {
    public static VideoDto from(Video v) {
        String yt = v.getYoutubeId();
        return new VideoDto(
                v.getId(),
                yt,
                v.getTitle(),
                v.getOrderIndex(),
                yt != null ? "https://img.youtube.com/vi/" + yt + "/hqdefault.jpg" : null,
                yt != null ? "https://www.youtube.com/watch?v=" + yt : null
        );
    }
}
