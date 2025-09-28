package com.productcatalog.config;

import com.productcatalog.entity.Admin;
import com.productcatalog.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin user already exists
        if (!adminRepository.existsByUsername("admin")) {
            // Create admin user with properly hashed password
            Admin adminUser = new Admin();
            adminUser.setUsername("admin");
            adminUser.setPasswordHash(passwordEncoder.encode("admin123")); // This will generate the correct hash
            
            adminRepository.save(adminUser);
            System.out.println("✅ Admin user created successfully with username: admin, password: admin123");
            System.out.println("✅ Password hash generated: " + adminUser.getPasswordHash());
        } else {
            System.out.println("✅ Admin user already exists");
        }
    }
}
