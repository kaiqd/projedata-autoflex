package com.autoflex.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductMaterialItemRequest(
        @NotNull UUID rawMaterialId,
        @NotNull @Positive BigDecimal requiredQuantity
) {}
