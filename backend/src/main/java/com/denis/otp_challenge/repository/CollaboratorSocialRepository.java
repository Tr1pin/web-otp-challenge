package com.denis.otp_challenge.repository;

import com.denis.otp_challenge.model.CollaboratorSocial;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CollaboratorSocialRepository extends JpaRepository<CollaboratorSocial, Long> {
    List<CollaboratorSocial> findByCollaboratorId(Long collaboratorId);
}