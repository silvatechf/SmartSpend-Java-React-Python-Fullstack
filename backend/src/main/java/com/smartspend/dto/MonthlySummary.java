package com.smartspend.dto;

// Remover import java.math.BigDecimal

public class MonthlySummary {
    
    private String category;
    private Double totalAmount; 
    private String monthYear;

    // Construtor OBRIGATÓRIO (String, Double, String)
    public MonthlySummary(String category, Double totalAmount, String monthYear) {
        this.category = category;
        this.totalAmount = totalAmount;
        this.monthYear = monthYear;
    }

    // Getters
    public String getCategory() {
        return category;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public String getMonthYear() {
        return monthYear;
    }
}