package com.denis.otp_challenge.repository;

import com.denis.otp_challenge.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByUserId(Long userId);
    Optional<Vote> findByUserIdAndChampionId(Long userId, Long championId);
    long countByChampionId(Long championId);
    boolean existsByUserIdAndChampionId(Long userId, Long championId);
}