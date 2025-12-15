package com.smartspend.dto;

public record AiResultItem(
    String description, 
    double amount, 
    String category,
    String source, 
    String paymentMethod 
) {}