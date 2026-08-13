package com.denis.otp_challenge.service;

import com.denis.otp_challenge.dto.VoteDto;
import com.denis.otp_challenge.model.Vote;
import com.denis.otp_challenge.repository.VoteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VoteService {

    private final VoteRepository voteRepository;

    public VoteService(VoteRepository voteRepository) {
        this.voteRepository = voteRepository;
    }

    @Transactional(readOnly = true)
    public List<VoteDto> findAll() {
        return voteRepository.findAll().stream()
                .map(VoteDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public long countForChampion(Long championId) {
        return voteRepository.countByChampionId(championId);
    }

    public VoteDto create(Vote vote) {
        return VoteDto.from(voteRepository.save(vote));
    }

    public void delete(Long id) {
        Vote existing = voteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vote not found: " + id));
        voteRepository.delete(existing);
    }
}
