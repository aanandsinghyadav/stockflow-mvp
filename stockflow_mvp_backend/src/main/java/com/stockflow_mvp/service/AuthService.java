package com.stockflow_mvp.service;

import com.stockflow_mvp.dto.AuthResponse;
import com.stockflow_mvp.dto.LoginRequest;
import com.stockflow_mvp.dto.SignupRequest;
import com.stockflow_mvp.entity.Organization;
import com.stockflow_mvp.entity.User;
import com.stockflow_mvp.exception.BadRequestException;
import com.stockflow_mvp.exception.ResourceNotFoundException;
import com.stockflow_mvp.repository.UserRepository;
import com.stockflow_mvp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final OrganizationService organizationService;

    @Transactional
    public AuthResponse signup(SignupRequest request) {

        // Prevent duplicate accounts
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("An account with this email already exists");
        }

        Organization org = organizationService.createOrganization(request.getOrganizationName());

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .organization(org)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .organizationName(org.getName())
                .build();
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {

            throw new BadRequestException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .organizationName(user.getOrganization().getName())
                .build();
    }
}
