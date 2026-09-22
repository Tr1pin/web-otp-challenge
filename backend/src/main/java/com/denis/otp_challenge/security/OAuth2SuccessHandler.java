package com.denis.otp_challenge.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;

    @Value("${app.frontend-url:http://localhost:4321}")
    private String publicUrl;

    @Value("${app.admin-url:http://localhost:4200}")
    private String adminUrl;

    public OAuth2SuccessHandler(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String token = jwtService.generateToken(email);

        ResponseCookie cookie = ResponseCookie.from("token", token)
                .httpOnly(true)
                .secure(true)
                .sameSite("None")
                .path("/")
                .maxAge(24 * 60 * 60)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());


        String target = publicUrl;
        if (request.getCookies() != null) {
            for (var c : request.getCookies()) {
                if ("oauth_origin".equals(c.getName()) && "admin".equals(c.getValue())) {
                    target = adminUrl;
                    break;
                }
            }
        }

        // Limpiamos la cookie temporal de origen.
        ResponseCookie clear = ResponseCookie.from("oauth_origin", "")
                .path("/").maxAge(0).sameSite("None").secure(true).build();
        response.addHeader(HttpHeaders.SET_COOKIE, clear.toString());

        getRedirectStrategy().sendRedirect(request, response, target);
    }
}