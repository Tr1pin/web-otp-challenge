package com.denis.otp_challenge.service;

import com.denis.otp_challenge.dto.CollaboratorSocialDto;
import com.denis.otp_challenge.model.CollaboratorSocial;
import com.denis.otp_challenge.repository.CollaboratorSocialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CollaboratorSocialService {

    private final CollaboratorSocialRepository socialRepository;

    public CollaboratorSocialService(CollaboratorSocialRepository socialRepository) {
        this.socialRepository = socialRepository;
    }

    @Transactional(readOnly = true)
    public List<CollaboratorSocialDto> findAll() {
        return socialRepository.findAll().stream()
                .map(CollaboratorSocialDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public CollaboratorSocialDto findById(Long id) {
        CollaboratorSocial s = socialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Social not found: " + id));
        return CollaboratorSocialDto.from(s);
    }

    @Transactional(readOnly = true)
    public List<CollaboratorSocialDto> findByCollaborator(Long collaboratorId) {
        return socialRepository.findByCollaboratorId(collaboratorId).stream()
                .map(CollaboratorSocialDto::from)
                .toList();
    }

    public CollaboratorSocialDto create(CollaboratorSocial social) {
        return CollaboratorSocialDto.from(socialRepository.save(social));
    }

    public CollaboratorSocialDto update(Long id, CollaboratorSocial data) {
        CollaboratorSocial existing = socialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Social not found: " + id));
        existing.setPlatform(data.getPlatform());
        existing.setUrl(data.getUrl());
        existing.setCollaborator(data.getCollaborator());
        return CollaboratorSocialDto.from(socialRepository.save(existing));
    }

    public CollaboratorSocialDto patch(Long id, CollaboratorSocial data) {
        CollaboratorSocial existing = socialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Social not found: " + id));
        if (data.getPlatform() != null)     existing.setPlatform(data.getPlatform());
        if (data.getUrl() != null)          existing.setUrl(data.getUrl());
        if (data.getCollaborator() != null) existing.setCollaborator(data.getCollaborator());
        return CollaboratorSocialDto.from(socialRepository.save(existing));
    }

    public void delete(Long id) {
        CollaboratorSocial existing = socialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Social not found: " + id));
        socialRepository.delete(existing);
    }

}
