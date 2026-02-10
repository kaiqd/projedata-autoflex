package com.autoflex.backend.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductMaterialItemResponse(
        UUID id,
        UUID rawMaterialId,
        String rawMaterialCode,
        String rawMaterialName,
        BigDecimal requiredQuantity
) {}
