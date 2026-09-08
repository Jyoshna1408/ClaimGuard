package com.claimguard.claimguard_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.claimguard.claimguard_backend.entity.Claim;
import com.claimguard.claimguard_backend.entity.User;
import com.claimguard.claimguard_backend.repository.ClaimRepository;
import com.claimguard.claimguard_backend.repository.UserRepository;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final UserRepository userRepository;

    public ClaimService(
            ClaimRepository claimRepository,
            UserRepository userRepository) {

        this.claimRepository = claimRepository;
        this.userRepository = userRepository;
    }

    public Claim createClaim(
            String claimType,
            double amount,
            String description,
            Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Claim claim = new Claim(
                claimType,
                amount,
                description,
                user
        );

        return claimRepository.save(claim);
    }

    public List<Claim> getUserClaims(Long userId) {
        return claimRepository.findByUserId(userId);
    }

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Claim updateStatus(Long claimId, String status) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        claim.setStatus(status);

        return claimRepository.save(claim);
    }

    public Claim getClaim(Long id) {

        return claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found"));
    }
}