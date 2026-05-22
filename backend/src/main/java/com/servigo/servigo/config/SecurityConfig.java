package com.servigo.servigo.config;

import com.servigo.servigo.jwt.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity // <-- ¡Ponlo aquí y borra AdminSecurityConfig.java!
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {})
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Public endpoints (no auth required)
                .requestMatchers(
                    "/auth/**",
                    "/usuarios/registro",
                    "/usuarios/registro/**",
                    "/usuarios/registro-con-foto",
                    "/cloudinary/upload",
                    "/swagger-ui/**",
                    "/v3/api-docs/**"
                ).permitAll()
                .requestMatchers(HttpMethod.POST,
                    "/usuarios/registro",
                    "/usuarios/registro-con-foto",
                    "/usuarios/registro/**"
                ).permitAll()
                // Public GET browsing
                .requestMatchers(HttpMethod.GET, "/prestadores/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/servicios/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/especialidades/**").permitAll()
                // Admin only
                .requestMatchers("/admin/**").hasRole("ADMIN")
                // Everything else requires authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}