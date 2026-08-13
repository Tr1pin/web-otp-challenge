package com.denis.otp_challenge.repository;

import com.denis.otp_challenge.model.Champion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChampionRepository extends JpaRepository<Champion, Long> {
    List<Champion> findAllByOrderByOrderIndexAsc();
    List<Champion> findAllByOrderByVoteCountDesc();
    List<Champion> findAllByOrderByWinRatioDesc();
}