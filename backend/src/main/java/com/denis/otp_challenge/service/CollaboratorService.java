package com.denis.otp_challenge.service;

import com.denis.otp_challenge.dto.CollaboratorDto;
import com.denis.otp_challenge.model.Collaborator;
import com.denis.otp_challenge.model.CollaboratorSocial;
import com.denis.otp_challenge.repository.CollaboratorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CollaboratorService {

    private final CollaboratorRepository collaboratorRepository;

    public CollaboratorService(CollaboratorRepository collaboratorRepository) {
        this.collaboratorRepository = collaboratorRepository;
    }

    @Transactional(readOnly = true)
    public List<CollaboratorDto> findAll() {
        return collaboratorRepository.findAll().stream()
                .map(CollaboratorDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CollaboratorDto findById(Long id) {
        Collaborator c = collaboratorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collaborator not found: " + id));
        return CollaboratorDto.from(c);
    }

    @Transactional
    public CollaboratorDto create(Collaborator collaborator) {
        linkSocials(collaborator);
        Collaborator saved = collaboratorRepository.save(collaborator);
        return CollaboratorDto.from(saved);
    }

    @Transactional
    public CollaboratorDto update(Long id, Collaborator data) {
        Collaborator existing = collaboratorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collaborator not found: " + id));

        existing.setName(data.getName());
        existing.setPhotoUrl(data.getPhotoUrl());
        existing.setBio(data.getBio());

        // Clean socials
        existing.getSocials().clear();

        if (data.getSocials() != null) {
            for (CollaboratorSocial s : data.getSocials()) {
                s.setId(null);
                s.setCollaborator(existing);

                // Add new socials
                existing.getSocials().add(s);
            }
        }

        return CollaboratorDto.from(collaboratorRepository.save(existing));
    }

    @Transactional
    public CollaboratorDto patch(Long id, Collaborator data) {
        Collaborator existing = collaboratorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collaborator not found: " + id));
        if (data.getName() != null)     existing.setName(data.getName());
        if (data.getPhotoUrl() != null) existing.setPhotoUrl(data.getPhotoUrl());
        if (data.getBio() != null)      existing.setBio(data.getBio());
        return CollaboratorDto.from(collaboratorRepository.save(existing));
    }

    public void delete(Long id) {
        Collaborator existing = collaboratorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Collaborator not found: " + id));
        collaboratorRepository.delete(existing);
    }

    private void linkSocials(Collaborator collaborator) {
        if (collaborator.getSocials() != null) {
            for (CollaboratorSocial s : collaborator.getSocials()) {
                s.setCollaborator(collaborator);
            }
        }
    }

}
