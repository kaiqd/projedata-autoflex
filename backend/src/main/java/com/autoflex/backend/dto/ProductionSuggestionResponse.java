package com.autoflex.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record ProductionSuggestionResponse(
        List<ProductionSuggestionItemResponse> items,
        BigDecimal totalValue
) {}
