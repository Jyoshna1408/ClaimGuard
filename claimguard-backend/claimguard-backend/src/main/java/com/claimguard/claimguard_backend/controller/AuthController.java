package com.claimguard.claimguard_backend.controller;

import com.claimguard.claimguard_backend.dto.LoginRequest;
import com.claimguard.claimguard_backend.dto.RegisterRequest;
import com.claimguard.claimguard_backend.dto.UserResponse;
import com.claimguard.claimguard_backend.entity.User;
import com.claimguard.claimguard_backend.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*"})
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {
        User user = new User(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getRole() == null || request.getRole().isBlank()
                        ? "CUSTOMER"
                        : request.getRole()
        );

        return UserResponse.from(userService.register(user));
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody LoginRequest request) {
        return UserResponse.from(userService.login(
                request.getEmail(),
                request.getPassword()
        ));
    }
}
