package com.smartspend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Data // Inclui getters/setters/toString/equals do Lombok
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private double amount; // Mantendo Double, conforme a correção do ClassCastException

    private String category;
    
    @Column(nullable = false)
    private LocalDate transactionDate;
    
    // --- NOVOS CAMPOS PARA ANÁLISE DETALHADA ---
    private String source; // Onde a transação ocorreu (Local da Compra)
    private String paymentMethod; // Como foi paga (Método de Pagamento)
    // ------------------------------------------

    // O Lombok @Data gera construtores, getters e setters
}