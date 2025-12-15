// src/main/java/com/smartspend/controller/AuthController.java - AJUSTADO PARA TIPOS CORRETOS

package com.smartspend.controller; 

import com.smartspend.service.AuthService; 
import com.smartspend.dto.AuthRequest; 
import com.smartspend.dto.RegisterRequest; 
import com.smartspend.dto.AuthResponse; 

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth") 
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService; 

    @PostMapping("/register") 
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        
        AuthResponse response = authService.register(request); 
        return ResponseEntity.ok(response);
    }

   
    @PostMapping("/login") 
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        // CORREÇÃO: Chamando o método 'authenticate' (Se este nome falhar, tente 'login' no Service)
        AuthResponse response = authService.authenticate(request); 
        return ResponseEntity.ok(response);
    }
}