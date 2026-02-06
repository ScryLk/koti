package com.kodi.auth;

import com.kodi.auth.dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Validated LoginRequest request) {
        String token = authService.login(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(Map.of("token", token));
    }

    @GetMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestParam String subject) {
        String token = authService.refresh(subject);
        return ResponseEntity.ok(Map.of("token", token));
    }
}
