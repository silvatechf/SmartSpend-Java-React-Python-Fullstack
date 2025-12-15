package com.smartspend.controller;

import com.smartspend.dto.TransactionRequest;
import com.smartspend.dto.TransactionResponse;
import com.smartspend.service.TransactionService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID; // Manter apenas se Transactions tiverem UUIDs
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * Cria uma nova transação.
     * Rota: POST /api/transactions
     */
    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(@RequestBody TransactionRequest request) {
        TransactionResponse response = transactionService.createTransaction(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Busca todas as transações de um usuário específico.
     * Rota: GET /api/transactions/user/{userId}
     *
     * CORREÇÃO CRÍTICA: O parâmetro é Long, não UUID (Linha 54 e 67 nos logs originais)
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByUserId(@PathVariable Long userId) {
        // Assume que o Service também foi corrigido para aceitar Long
        List<TransactionResponse> transactions = transactionService.getTransactionsByUserId(userId); 
        return ResponseEntity.ok(transactions);
    }
    
    /**
     * Busca uma transação específica por ID.
     * Rota: GET /api/transactions/{transactionId}
     */
    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> getTransactionById(@PathVariable Long transactionId) {
        // Usamos Long aqui também, assumindo que as transações usam Long ID.
        TransactionResponse response = transactionService.getTransactionById(transactionId);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Atualiza uma transação.
     * Rota: PUT /api/transactions/{transactionId}
     */
    @PutMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> updateTransaction(
            @PathVariable Long transactionId, 
            @RequestBody TransactionRequest request) {
        
        TransactionResponse response = transactionService.updateTransaction(transactionId, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Deleta uma transação.
     * Rota: DELETE /api/transactions/{transactionId}
     */
    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long transactionId) {
        transactionService.deleteTransaction(transactionId);
        return ResponseEntity.noContent().build();
    }
}