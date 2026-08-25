package com.denis.otp_challenge.controller;

import com.denis.otp_challenge.dto.MyVoteDto;
import com.denis.otp_challenge.dto.VoteDto;
import com.denis.otp_challenge.dto.VoteResultDto;
import com.denis.otp_challenge.service.VoteService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/votes")
public class VoteController {

    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }


    @PostMapping("/champion/{championId}")
    public VoteResultDto vote(@PathVariable Long championId, Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return voteService.vote(email, championId);
    }


    @GetMapping("/me")
    public MyVoteDto myVote(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return voteService.myVote(email);
    }


    @GetMapping
    public List<VoteDto> getAll() {
        return voteService.findAll();
    }

    @GetMapping("/champion/{championId}/count")
    public long countForChampion(@PathVariable Long championId) {
        return voteService.countForChampion(championId);
    }

}