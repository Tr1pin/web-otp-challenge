package com.denis.otp_challenge.repository;

import com.denis.otp_challenge.model.Video;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VideoRepository extends JpaRepository<Video, Long> {

    // Vídeos de un champion, ordenados por su orderIndex
    List<Video> findByChampionIdOrderByOrderIndexAsc(Long championId);
}
