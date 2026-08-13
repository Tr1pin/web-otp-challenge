package com.denis.otp_challenge.controller;

import com.denis.otp_challenge.dto.VoteDto;
import com.denis.otp_challenge.model.Vote;
import com.denis.otp_challenge.service.VoteService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/votes")
public class VoteController {

    private final VoteService voteService;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @GetMapping
    public List<VoteDto> getAll() {
        return voteService.findAll();
    }

    @GetMapping("/champion/{championId}/count")
    public long countForChampion(@PathVariable Long championId) {
        return voteService.countForChampion(championId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        voteService.delete(id);
    }
}