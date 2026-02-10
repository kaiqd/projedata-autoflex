package com.autoflex.backend.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductionSuggestionItemResponse(
        UUID productId,
        String productCode,
        String productName,
        BigDecimal unitPrice,
        int suggestedQuantity,
        BigDecimal totalValue
) {}
