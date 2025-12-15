package com.smartspend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.smartspend.config.jwt.JwtAuthenticationFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    // Presumimos que você tenha estas dependências
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. CONFIGURAÇÃO CORS CRÍTICA
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // Usa o Bean abaixo para configurar o CORS
                
                // 2. DESABILITAR CSRF (Comum em APIs Stateless)
                .csrf(csrf -> csrf.disable())
                
                // 3. DEFINIÇÃO DE AUTORIZAÇÃO DE ROTAS
                .authorizeHttpRequests(auth -> auth
                        // Permite acesso público a rotas de autenticação (Login e Cadastro)
                        .requestMatchers("/api/auth/**").permitAll() 
                        
                        // Permite acesso público ao endpoint do Swagger (se aplicável)
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()
                        
                        // Rotas de utilidade que podem ser acessadas publicamente (ex: GETs)
                        .requestMatchers(HttpMethod.GET, "/api/public/**").permitAll() 
                        
                        // Todas as outras requisições PRECISAM de autenticação
                        .anyRequest().authenticated()
                )
                
                // 4. CONFIGURAÇÃO DE SESSÃO COMO STATELESS (Para uso de JWT)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                
                // 5. CONFIGURAÇÃO DO PROVIDER DE AUTENTICAÇÃO
                .authenticationProvider(authenticationProvider)
                
                // 6. ADICIONAR O FILTRO JWT
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Bean para configurar o CORS, permitindo acesso do Frontend Vite (porta 5173).
     * Esta é a maneira correta de configurar o CORS com Spring Security.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // CRÍTICO: Permite o acesso do Frontend
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); 
        
        // Permite os métodos essenciais, incluindo OPTIONS (para preflight)
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); 
        configuration.setAllowedHeaders(List.of("*")); // Permite todos os headers
        configuration.setAllowCredentials(true); // Permite cookies e headers de autenticação
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Aplica a todas as rotas
        return source;
    }
}