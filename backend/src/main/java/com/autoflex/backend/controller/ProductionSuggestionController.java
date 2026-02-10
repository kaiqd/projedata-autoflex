package com.autoflex.backend.controller;

import com.autoflex.backend.dto.ProductionSuggestionResponse;
import com.autoflex.backend.service.ProductionSuggestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/production-suggestions")
@RequiredArgsConstructor
public class ProductionSuggestionController {

    private final ProductionSuggestionService service;

    @GetMapping
    public ProductionSuggestionResponse suggest() {
        return service.suggest();
    }
}
