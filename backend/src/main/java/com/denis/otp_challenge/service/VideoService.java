package com.denis.otp_challenge.service;

import com.denis.otp_challenge.dto.VideoDto;
import com.denis.otp_challenge.model.Champion;
import com.denis.otp_challenge.model.Video;
import com.denis.otp_challenge.repository.ChampionRepository;
import com.denis.otp_challenge.repository.VideoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VideoService {

    private final VideoRepository videoRepository;
    private final ChampionRepository championRepository;

    public VideoService(VideoRepository videoRepository,
                        ChampionRepository championRepository) {
        this.videoRepository = videoRepository;
        this.championRepository = championRepository;
    }

    // ---------- LECTURA ----------

    @Transactional(readOnly = true)
    public List<VideoDto> findAll() {
        return videoRepository.findAll().stream()
                .map(VideoDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public VideoDto findById(Long id) {
        Video v = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found: " + id));
        return VideoDto.from(v);
    }

    @Transactional(readOnly = true)
    public List<VideoDto> findByChampion(Long championId) {
        return videoRepository.findByChampionIdOrderByOrderIndexAsc(championId).stream()
                .map(VideoDto::from)
                .toList();
    }

    // ---------- ESCRITURA ----------

    @Transactional
    public VideoDto create(Video video) {
        video.setChampion(resolveChampion(video.getChampion()));
        return VideoDto.from(videoRepository.save(video));
    }

    @Transactional
    public VideoDto update(Long id, Video data) {
        Video existing = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found: " + id));
        existing.setYoutubeId(data.getYoutubeId());
        existing.setTitle(data.getTitle());
        existing.setOrderIndex(data.getOrderIndex());
        if (data.getChampion() != null) {
            existing.setChampion(resolveChampion(data.getChampion()));
        }
        return VideoDto.from(videoRepository.save(existing));
    }

    @Transactional
    public VideoDto patch(Long id, Video data) {
        Video existing = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found: " + id));
        if (data.getYoutubeId() != null) existing.setYoutubeId(data.getYoutubeId());
        if (data.getTitle() != null)     existing.setTitle(data.getTitle());
        if (data.getChampion() != null)  existing.setChampion(resolveChampion(data.getChampion()));
        return VideoDto.from(videoRepository.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        Video existing = videoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Video not found: " + id));
        videoRepository.delete(existing);
    }

    // ---------- helper ----------
    private Champion resolveChampion(Champion incoming) {
        if (incoming == null || incoming.getId() == null) {
            return null;
        }
        return championRepository.findById(incoming.getId())
                .orElseThrow(() -> new RuntimeException(
                        "Champion not found: " + incoming.getId()));
    }
}
