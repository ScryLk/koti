package com.kodi.config;

import com.kodi.auth.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    @Bean
    public JwtTokenProvider jwtTokenProvider(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.validityMs}") long validityMs
    ) {
        return new JwtTokenProvider(secret, validityMs);
    }
}
