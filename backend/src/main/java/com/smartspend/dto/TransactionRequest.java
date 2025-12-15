package com.smartspend.dto;

import java.time.LocalDate;

public record TransactionRequest(
    String description, 
    double amount, 
    String category, 
    String source, 
    LocalDate transactionDate
) {}