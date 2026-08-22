package com.denis.otp_challenge.security;

import com.denis.otp_challenge.model.User;
import com.denis.otp_challenge.model.enums.AuthProvider;
import com.denis.otp_challenge.model.enums.Role;
import com.denis.otp_challenge.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String googleId = oAuth2User.getAttribute("sub"); // id único de Google

        userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setDisplayName(name);
            newUser.setRole(Role.USER);
            newUser.setProvider(AuthProvider.GOOGLE);
            newUser.setProviderId(googleId);

            return userRepository.save(newUser);
        });

        return oAuth2User;
    }
}