package com.denis.otp_challenge.repository;

import com.denis.otp_challenge.model.Collaborator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollaboratorRepository extends JpaRepository<Collaborator, Long> {
}
