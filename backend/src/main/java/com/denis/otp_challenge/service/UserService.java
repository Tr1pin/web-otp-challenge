package com.denis.otp_challenge.service;

import com.denis.otp_challenge.dto.UserDto;
import com.denis.otp_challenge.model.User;
import com.denis.otp_challenge.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<UserDto> findAll() {
        return userRepository.findAll().stream()
                .map(UserDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserDto findById(Long id) {
        User u = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        return UserDto.from(u);
    }

    public UserDto create(User user) {
        return UserDto.from(userRepository.save(user));
    }

    public void delete(Long id) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        userRepository.delete(existing);
    }
}
