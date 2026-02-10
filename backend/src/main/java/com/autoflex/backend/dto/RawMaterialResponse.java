package com.autoflex.backend.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record RawMaterialResponse(
        UUID id,
        String code,
        String name,
        BigDecimal stockQuantity
) {}
