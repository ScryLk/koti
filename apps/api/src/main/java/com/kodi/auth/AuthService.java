package com.kodi.auth;

import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public String login(String username, String password) {
        // MVP: autenticação estática. Substituir por integração com usuários/DB.
        if ("admin".equals(username) && "kodi123".equals(password)) {
            return jwtTokenProvider.createToken(username);
        }
        throw new RuntimeException("Credenciais inválidas");
    }

    public String refresh(String subject) {
        return jwtTokenProvider.createToken(subject);
    }
}
