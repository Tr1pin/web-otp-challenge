package com.denis.otp_challenge.service;

import com.denis.otp_challenge.dto.ChampionDto;
import com.denis.otp_challenge.model.Champion;
import com.denis.otp_challenge.model.Collaborator;
import com.denis.otp_challenge.repository.ChampionRepository;
import com.denis.otp_challenge.repository.CollaboratorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;

import java.util.List;

@Service
public class ChampionService {

    private final ChampionRepository championRepository;
    private final CollaboratorRepository collaboratorRepository;

    public ChampionService(ChampionRepository championRepository,
                           CollaboratorRepository collaboratorRepository) {
        this.championRepository = championRepository;
        this.collaboratorRepository = collaboratorRepository;
    }

    @Transactional(readOnly = true)
    public List<ChampionDto> findAll(String sort) {
        List<Champion> champions = switch (sort == null ? "" : sort) {
            case "votes"    -> championRepository.findAllByOrderByVoteCountDesc();
            case "winratio" -> championRepository.findAllByOrderByWinRatioDesc();
            default          -> championRepository.findAllByOrderByOrderIndexAsc();
        };
        return champions.stream().map(ChampionDto::from).toList();
    }

    @Transactional(readOnly = true)
    public ChampionDto findById(Long id) {
        Champion c = championRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Champion not found: " + id));
        return ChampionDto.from(c);
    }

    @Transactional
    public ChampionDto create(Champion champion) {
        champion.setCollaborator(resolveCollaborator(champion.getCollaborator()));
        champion.setWinRatio(calcWinRatio(champion.getWins(), champion.getLosses()));
        return ChampionDto.from(championRepository.save(champion));
    }

    @Transactional
    public ChampionDto update(Long id, Champion data) {
        Champion existing = championRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Champion not found: " + id));
        existing.setName(data.getName());
        existing.setChampionKey(data.getChampionKey());
        existing.setPhotoUrl(data.getPhotoUrl());
        existing.setWinRatio(calcWinRatio(data.getWins(), data.getLosses()));
        existing.setWins(data.getWins());
        existing.setLosses(data.getLosses());
        existing.setNotes(data.getNotes());
        existing.setOrderIndex(data.getOrderIndex());
        existing.setStatus(data.getStatus());
        if (data.getCollaborator() != null) {
            existing.setCollaborator(resolveCollaborator(data.getCollaborator()));
        }
        return ChampionDto.from(championRepository.save(existing));
    }

    @Transactional
    public ChampionDto patch(Long id, Champion data) {
        Champion existing = championRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Champion not found: " + id));
        if (data.getName() != null)         existing.setName(data.getName());
        if (data.getChampionKey() != null)  existing.setChampionKey(data.getChampionKey());
        if (data.getPhotoUrl() != null)     existing.setPhotoUrl(data.getPhotoUrl());
        if (data.getWins() != 0 || data.getLosses() != 0) {
            existing.setWins(data.getWins());
            existing.setLosses(data.getLosses());
        }
        existing.setWinRatio(calcWinRatio(existing.getWins(), existing.getLosses()));
        if (data.getNotes() != null)        existing.setNotes(data.getNotes());
        if (data.getStatus() != null)       existing.setStatus(data.getStatus());
        if (data.getCollaborator() != null) {
            existing.setCollaborator(resolveCollaborator(data.getCollaborator()));
        }
        return ChampionDto.from(championRepository.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        Champion existing = championRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Champion not found: " + id));
        championRepository.delete(existing);
    }

    private Collaborator resolveCollaborator(Collaborator incoming) {
        if (incoming == null || incoming.getId() == null) {
            return null;
        }
        return collaboratorRepository.findById(incoming.getId())
                .orElseThrow(() -> new RuntimeException(
                        "Collaborator not found: " + incoming.getId()));
    }

    private BigDecimal calcWinRatio(int wins, int losses) {
        int total = wins + losses;
        if (total == 0) {
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(wins)
                .divide(BigDecimal.valueOf(total), 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);
    }
}