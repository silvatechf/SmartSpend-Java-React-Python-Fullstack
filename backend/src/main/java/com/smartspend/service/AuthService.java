package com.smartspend.service;

import com.smartspend.dto.AuthRequest;
import com.smartspend.dto.AuthResponse;
import com.smartspend.dto.RegisterRequest;
import com.smartspend.model.User;
//import com.smartspend.model.Role; // Presumindo que você tem um enum Role
import com.smartspend.repository.UserRepository; // CRÍTICO: Pacote do Repository
import com.smartspend.service.JwtService; // CRÍTICO: Pacote do seu serviço JWT

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager; // CRÍTICO
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder; // CRÍTICO
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    // Dependências que o compilador estava reclamando:
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService; 
    private final AuthenticationManager authenticationManager;

    /**
     * Registra um novo usuário e retorna o JWT.
     * Assinatura CORRIGIDA para retornar AuthResponse (JWT).
     */
    public AuthResponse register(RegisterRequest request) {
        // 1. Criação do Usuário (Presumindo um builder com Lombok)
        User user = User.builder()
            .username(request.getUsername())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            //.role(Role.USER) 
            .build();
        userRepository.save(user);

        // 2. Geração do Token
        String jwtToken = jwtService.generateToken(user);

        // 3. Retorno
        return AuthResponse.builder()
            .token(jwtToken)
            .build();
    }

    /**
     * Autentica o usuário e retorna o JWT.
     * Assinatura CORRIGIDA para ser 'authenticate' e retornar AuthResponse (JWT).
     */
    public AuthResponse authenticate(AuthRequest request) {
        // 1. Autenticação (lança exceção se falhar)
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );
        
        // 2. Busca e Geração do Token (após sucesso na autenticação)
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new UsernameNotFoundException("User not found after successful authentication."));
            
        String jwtToken = jwtService.generateToken(user);

        // 3. Retorno
        return AuthResponse.builder()
            .token(jwtToken)
            .build();
    }
}