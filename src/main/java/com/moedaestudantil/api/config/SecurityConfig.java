package com.moedaestudantil.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos
                        .requestMatchers("/api/auth/**").permitAll()
                        // Endpoints protegidos por role
                        .requestMatchers("/api/empresas/**").hasAnyRole("EMPRESA", "ADMIN")
                        .requestMatchers("/api/vantagens").permitAll() // Listar vantagens é público
                        .requestMatchers("/api/vantagens/**").hasAnyRole("EMPRESA", "ADMIN") // Criar/editar/deletar apenas empresa
                        .requestMatchers("/api/moedas/professores/envio").hasAnyRole("PROFESSOR", "ADMIN")
                        .requestMatchers("/api/moedas/professores/extrato").hasAnyRole("PROFESSOR", "EMPRESA", "ADMIN")
                        .requestMatchers("/api/moedas/alunos/{alunoId}/extrato").hasAnyRole("ALUNO", "PROFESSOR", "EMPRESA", "ADMIN")
                        .requestMatchers("/api/moedas/alunos/{alunoId}/trocar-vantagem/**").hasAnyRole("ALUNO", "ADMIN")
                        .requestMatchers("/api/vantagens-adquiridas/alunos/{alunoId}").hasAnyRole("ALUNO", "ADMIN")
                        .requestMatchers("/api/vantagens-adquiridas/resgatar/**").hasAnyRole("ALUNO", "EMPRESA", "ADMIN")
                        .requestMatchers("/api/alunos").hasAnyRole("PROFESSOR", "EMPRESA", "ADMIN")
                        .requestMatchers("/api/alunos/{id}").hasAnyRole("ALUNO", "PROFESSOR", "EMPRESA", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/professores").hasAnyRole("PROFESSOR", "EMPRESA", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/professores").hasAnyRole("PROFESSOR", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/professores/{id}").hasAnyRole("PROFESSOR", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/professores/{id}").hasAnyRole("PROFESSOR", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/professores/{id}").hasAnyRole("PROFESSOR", "EMPRESA", "ADMIN")
                        .requestMatchers("/api/instituicoes/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

