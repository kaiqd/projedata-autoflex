package com.autoflex.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record RawMaterialRequest(
        @NotBlank String code,
        @NotBlank String name,
        @NotNull @PositiveOrZero BigDecimal stockQuantity
) {}
