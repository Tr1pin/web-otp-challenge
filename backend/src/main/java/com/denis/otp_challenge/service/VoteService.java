package com.denis.otp_challenge.service;

import com.denis.otp_challenge.dto.MyVoteDto;
import com.denis.otp_challenge.dto.VoteDto;
import com.denis.otp_challenge.dto.VoteResultDto;
import com.denis.otp_challenge.model.Champion;
import com.denis.otp_challenge.model.User;
import com.denis.otp_challenge.model.Vote;
import com.denis.otp_challenge.repository.ChampionRepository;
import com.denis.otp_challenge.repository.UserRepository;
import com.denis.otp_challenge.repository.VoteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class VoteService {

    private final VoteRepository voteRepository;
    private final ChampionRepository championRepository;
    private final UserRepository userRepository;

    public VoteService(VoteRepository voteRepository,
                       ChampionRepository championRepository,
                       UserRepository userRepository) {
        this.voteRepository = voteRepository;
        this.championRepository = championRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public VoteResultDto vote(String email, Long championId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));

        Champion target = championRepository.findById(championId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Campeon no encontrado: " + championId));

        Optional<Vote> existing = voteRepository.findByUserId(user.getId());

        if (existing.isPresent()) {
            Vote current = existing.get();
            Champion previous = current.getChampion();

            // Mismo champion → quitar voto
            if (previous.getId().equals(championId)) {
                voteRepository.delete(current);
                int newCount = target.getVoteCount() - 1;
                target.setVoteCount(newCount);
                championRepository.save(target);
                return new VoteResultDto(false, newCount, null, null);
            }

            // Otro champion → cambiar voto
            previous.setVoteCount(previous.getVoteCount() - 1);
            championRepository.save(previous);

            current.setChampion(target);
            voteRepository.save(current);

            int newCount = target.getVoteCount() + 1;
            target.setVoteCount(newCount);
            championRepository.save(target);
            return new VoteResultDto(true, newCount, target.getId(), target.getName());
        }

        // Sin voto -> hacer nuevo
        Vote nuevo = new Vote();
        nuevo.setUser(user);
        nuevo.setChampion(target);
        voteRepository.save(nuevo);

        int newCount = target.getVoteCount() + 1;
        target.setVoteCount(newCount);
        championRepository.save(target);
        return new VoteResultDto(true, newCount, target.getId(), target.getName());
    }

    @Transactional(readOnly = true)
    public MyVoteDto myVote(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));

        return voteRepository.findByUserId(user.getId())
                .map(v -> new MyVoteDto(v.getChampion().getId(), v.getChampion().getName()))
                .orElse(new MyVoteDto(null, null));
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

}