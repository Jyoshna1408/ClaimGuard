package com.claimguard.claimguard_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.claimguard.claimguard_backend.entity.Claim;
import com.claimguard.claimguard_backend.entity.User;
import com.claimguard.claimguard_backend.repository.ClaimRepository;
import com.claimguard.claimguard_backend.repository.UserRepository;
import com.claimguard.claimguard_backend.exception.ResourceNotFoundException;

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

        if (claimType == null || claimType.isBlank()) throw new IllegalArgumentException("Claim type is required");
        if (!Double.isFinite(amount) || amount <= 0) throw new IllegalArgumentException("Amount must be greater than zero");
        if (description == null || description.isBlank()) throw new IllegalArgumentException("Description is required");
        User user = userRepository.findById(userId == null ? -1L : userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Claim claim = new Claim(
                claimType,
                amount,
                description,
                user
        );

        return claimRepository.save(claim);
    }

    public List<Claim> getUserClaims(Long userId) {
        if (!userRepository.existsById(userId)) throw new ResourceNotFoundException("User not found");
        return claimRepository.findByUserId(userId);
    }

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Claim updateStatus(Long claimId, String status) {

        if (status == null || !(status.equalsIgnoreCase("PENDING") || status.equalsIgnoreCase("APPROVED") || status.equalsIgnoreCase("REJECTED"))) throw new IllegalArgumentException("Status must be PENDING, APPROVED, or REJECTED");
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));

        claim.setStatus(status.toUpperCase());

        return claimRepository.save(claim);
    }

    public Claim getClaim(Long id) {

        return claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
    }
}
