package com.claimguard.claimguard_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.claimguard.claimguard_backend.entity.Claim;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByUserId(Long userId);

    List<Claim> findByStatus(String status);
}