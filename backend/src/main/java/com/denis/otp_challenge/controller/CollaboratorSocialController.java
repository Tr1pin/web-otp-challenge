package com.denis.otp_challenge.controller;

import com.denis.otp_challenge.dto.CollaboratorSocialDto;
import com.denis.otp_challenge.model.CollaboratorSocial;
import com.denis.otp_challenge.service.CollaboratorSocialService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/socials")
public class CollaboratorSocialController {

    private final CollaboratorSocialService socialService;

    public CollaboratorSocialController(CollaboratorSocialService socialService) {
        this.socialService = socialService;
    }

    @GetMapping
    public List<CollaboratorSocialDto> getAll() {
        return socialService.findAll();
    }

    @GetMapping("/{id}")
    public CollaboratorSocialDto getById(@PathVariable Long id) {
        return socialService.findById(id);
    }

    @GetMapping("/collaborator/{collaboratorId}")
    public List<CollaboratorSocialDto> getByCollaborator(@PathVariable Long collaboratorId) {
        return socialService.findByCollaborator(collaboratorId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CollaboratorSocialDto create(@RequestBody CollaboratorSocial social) {
        return socialService.create(social);
    }

    @PutMapping("/{id}")
    public CollaboratorSocialDto update(@PathVariable Long id, @RequestBody CollaboratorSocial social) {
        return socialService.update(id, social);
    }

    @PatchMapping("/{id}")
    public CollaboratorSocialDto patch(@PathVariable Long id, @RequestBody CollaboratorSocial social) {
        return socialService.patch(id, social);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        socialService.delete(id);
    }
}