package com.smartspend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder; // CRÍTICO: Necessário para usar AuthResponse.builder()
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
}