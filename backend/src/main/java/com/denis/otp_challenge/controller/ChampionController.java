package com.denis.otp_challenge.controller;

import com.denis.otp_challenge.dto.ChampionDto;
import com.denis.otp_challenge.model.Champion;
import com.denis.otp_challenge.service.ChampionService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/champions")
public class ChampionController {

    private final ChampionService championService;

    public ChampionController(ChampionService championService) {
        this.championService = championService;
    }

    // GET /api/champions?sort=votes|winratio|order
    @GetMapping
    public List<ChampionDto> getAll(@RequestParam(required = false) String sort) {
        return championService.findAll(sort);
    }

    @GetMapping("/{id}")
    public ChampionDto getById(@PathVariable Long id) {
        return championService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChampionDto create(@RequestBody Champion champion) {
        return championService.create(champion);
    }

    @PutMapping("/{id}")
    public ChampionDto update(@PathVariable Long id, @RequestBody Champion champion) {
        return championService.update(id, champion);
    }

    @PatchMapping("/{id}")
    public ChampionDto patch(@PathVariable Long id, @RequestBody Champion champion) {
        return championService.patch(id, champion);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        championService.delete(id);
    }
}