// backend/src/main/java/com/smartspend/dto/AiResultsRequest.java

package com.smartspend.dto;

import java.util.List;

/**
 * DTO para receber o payload completo da análise de IA do Frontend.
 * Contém a lista de itens de transação e o resumo gerado pelo LLM.
 */
public record AiResultsRequest(
    List<AiResultItem> items, 
    String monthlySummaryText
) {}