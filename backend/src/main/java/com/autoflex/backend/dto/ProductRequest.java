package com.autoflex.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank String code,
        @NotBlank String name,
        @NotNull @Positive BigDecimal price
) {}
