package com.smartspend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    private Long id; // Ou UUID, se você usar UUIDs para transações
    private Long userId; // ID do usuário que fez a transação
    private Double amount;
    private String description;
    private String category;
    private LocalDateTime transactionDate;
    
    // Você pode adicionar mais campos conforme necessário
}