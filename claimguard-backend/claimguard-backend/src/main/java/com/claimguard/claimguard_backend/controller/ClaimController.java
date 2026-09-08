package com.claimguard.claimguard_backend.controller;

import com.claimguard.claimguard_backend.dto.ClaimRequest;
import com.claimguard.claimguard_backend.entity.Claim;
import com.claimguard.claimguard_backend.service.ClaimService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping
    public Claim createClaim(@RequestBody ClaimRequest request) {

        return claimService.createClaim(
                request.getClaimType(),
                request.getAmount(),
                request.getDescription(),
                request.getUserId()
        );
    }

    @GetMapping
    public List<Claim> getAllClaims() {
        return claimService.getAllClaims();
    }

    @GetMapping("/user/{userId}")
    public List<Claim> getUserClaims(@PathVariable Long userId) {
        return claimService.getUserClaims(userId);
    }

    @GetMapping("/{id}")
    public Claim getClaim(@PathVariable Long id) {
        return claimService.getClaim(id);
    }

    @PutMapping("/{id}/status")
    public Claim updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return claimService.updateStatus(id, status);
    }
}