package com.smartspend.repository;

import com.smartspend.model.Transaction; // Presumindo que você tenha esta classe de Modelo
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
// O segundo parâmetro, Long, deve ser o tipo do ID da sua entidade Transaction
public interface TransactionRepository extends JpaRepository<Transaction, Long> { 

    /**
     * CORREÇÃO CRÍTICA: O método findByUserId... deve usar Long para o userId, 
     * pois é o tipo usado na entidade User (e, consequentemente, na coluna 'user_id' 
     * da tabela 'transaction').
     */
    List<Transaction> findByUserIdAndTransactionDateBetween(
        Long userId, // Corrigido de UUID para Long
        LocalDate startDate, 
        LocalDate endDate
    );
    
    // Você pode adicionar mais métodos de busca aqui, se necessário:
    // List<Transaction> findByUserId(Long userId);
}