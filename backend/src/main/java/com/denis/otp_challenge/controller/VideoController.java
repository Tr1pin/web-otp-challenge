package com.denis.otp_challenge.controller;

import com.denis.otp_challenge.dto.VideoDto;
import com.denis.otp_challenge.model.Video;
import com.denis.otp_challenge.service.VideoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    // GET /api/videos
    @GetMapping
    public List<VideoDto> getAll() {
        return videoService.findAll();
    }

    // GET /api/videos/{id}
    @GetMapping("/{id}")
    public VideoDto getById(@PathVariable Long id) {
        return videoService.findById(id);
    }

    // GET /api/videos/champion/{championId}  -> vídeos de un OTP concreto
    @GetMapping("/champion/{championId}")
    public List<VideoDto> getByChampion(@PathVariable Long championId) {
        return videoService.findByChampion(championId);
    }

    // POST /api/videos
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VideoDto create(@RequestBody Video video) {
        return videoService.create(video);
    }

    // PUT /api/videos/{id}
    @PutMapping("/{id}")
    public VideoDto update(@PathVariable Long id, @RequestBody Video video) {
        return videoService.update(id, video);
    }

    // PATCH /api/videos/{id}
    @PatchMapping("/{id}")
    public VideoDto patch(@PathVariable Long id, @RequestBody Video video) {
        return videoService.patch(id, video);
    }

    // DELETE /api/videos/{id}
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        videoService.delete(id);
    }
}
