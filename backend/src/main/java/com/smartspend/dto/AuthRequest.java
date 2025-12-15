package com.smartspend.dto;

import lombok.AllArgsConstructor;
import lombok.Data; // Gera Getters (CRÍTICO: para request.getEmail(), request.getPassword())
import lombok.NoArgsConstructor;

@Data 
@NoArgsConstructor
@AllArgsConstructor
public class AuthRequest {

    private String email;
    private String password;
}