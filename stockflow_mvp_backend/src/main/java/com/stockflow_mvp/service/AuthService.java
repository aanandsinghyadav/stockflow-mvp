package com.stockflow_mvp.service;

import com.stockflow_mvp.dto.AuthRequest;
import com.stockflow_mvp.dto.AuthResponse;
import com.stockflow_mvp.entity.Organization;
import com.stockflow_mvp.entity.User;
import com.stockflow_mvp.repository.UserRepository;
import com.stockflow_mvp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    private final OrganizationService organizationService;

    public String signup(AuthRequest request) {

        Organization org = organizationService.createOrganization(request.getOrganizationName());

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .organization(org)
                .build();

        userRepository.save(user);

        return "User registered successfully";
    }

    public AuthResponse login(AuthRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token);
    }
}