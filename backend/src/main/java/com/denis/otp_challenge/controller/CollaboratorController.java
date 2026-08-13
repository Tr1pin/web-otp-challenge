package com.denis.otp_challenge.controller;

import com.denis.otp_challenge.dto.CollaboratorDto;
import com.denis.otp_challenge.model.Collaborator;
import com.denis.otp_challenge.service.CollaboratorService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collaborators")
public class CollaboratorController {

    private final CollaboratorService collaboratorService;

    public CollaboratorController(CollaboratorService collaboratorService) {
        this.collaboratorService = collaboratorService;
    }

    @GetMapping
    public List<CollaboratorDto> getAll() {
        return collaboratorService.findAll();
    }

    @GetMapping("/{id}")
    public CollaboratorDto getById(@PathVariable Long id) {
        return collaboratorService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CollaboratorDto create(@RequestBody Collaborator collaborator) {
        return collaboratorService.create(collaborator);
    }

    @PutMapping("/{id}")
    public CollaboratorDto update(@PathVariable Long id, @RequestBody Collaborator collaborator) {
        return collaboratorService.update(id, collaborator);
    }

    @PatchMapping("/{id}")
    public CollaboratorDto patch(@PathVariable Long id, @RequestBody Collaborator collaborator) {
        return collaboratorService.patch(id, collaborator);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        collaboratorService.delete(id);
    }
}