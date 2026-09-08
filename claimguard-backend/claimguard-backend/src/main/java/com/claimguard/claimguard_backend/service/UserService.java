package com.claimguard.claimguard_backend.service;

import org.springframework.stereotype.Service;

import com.claimguard.claimguard_backend.entity.User;
import com.claimguard.claimguard_backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(User user) {
        if (user.getName() == null || user.getName().isBlank()) throw new IllegalArgumentException("Name is required");
        if (user.getEmail() == null || user.getEmail().isBlank() || !user.getEmail().contains("@")) throw new IllegalArgumentException("A valid email is required");
        user.setEmail(user.getEmail().trim().toLowerCase());
        if (user.getPassword() == null || user.getPassword().length() < 6) throw new IllegalArgumentException("Password must be at least 6 characters");
        if (user.getRole() == null || user.getRole().isBlank()) user.setRole("CUSTOMER");
        user.setRole(user.getRole().trim().toUpperCase());
        if (!user.getRole().equals("CUSTOMER") && !user.getRole().equals("OFFICER")) throw new IllegalArgumentException("Role must be CUSTOMER or OFFICER");
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        return userRepository.save(user);
    }

    public User login(String email, String password) {
        if (email == null || email.isBlank() || password == null || password.isBlank()) throw new IllegalArgumentException("Email and password are required");
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (user.getPassword() == null || !user.getPassword().equals(password)) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return user;
    }
}
