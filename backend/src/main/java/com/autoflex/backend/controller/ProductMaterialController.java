package com.autoflex.backend.controller;

import com.autoflex.backend.dto.ProductMaterialItemRequest;
import com.autoflex.backend.dto.ProductMaterialItemResponse;
import com.autoflex.backend.service.ProductMaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products/{productId}/materials")
@RequiredArgsConstructor
public class ProductMaterialController {

    private final ProductMaterialService service;

    @PutMapping
    public List<ProductMaterialItemResponse> replace(
            @PathVariable UUID productId,
            @RequestBody @Valid List<ProductMaterialItemRequest> items
    ) {
        return service.replaceMaterials(productId, items);
    }

    @GetMapping
    public List<ProductMaterialItemResponse> list(@PathVariable UUID productId) {
        return service.listMaterials(productId);
    }
}
