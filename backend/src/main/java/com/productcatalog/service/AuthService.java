package com.productcatalog.service;

import com.productcatalog.dto.LoginRequest;
import com.productcatalog.dto.LoginResponse;
import com.productcatalog.entity.Admin;
import com.productcatalog.repository.AdminRepository;
import com.productcatalog.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    public LoginResponse authenticateUser(LoginRequest loginRequest) {
        Admin admin = adminRepository.findByUsername(loginRequest.getUsername())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), admin.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        String jwt = jwtUtils.generateJwtToken(admin.getUsername());
        long expirationTime = jwtUtils.getExpirationTime();
        
        return new LoginResponse(jwt, expirationTime, admin.getUsername());
    }
    
    public boolean existsByUsername(String username) {
        return adminRepository.existsByUsername(username);
    }
}
