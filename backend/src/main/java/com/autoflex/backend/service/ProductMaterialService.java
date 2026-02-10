package com.autoflex.backend.service;

import com.autoflex.backend.dto.ProductMaterialItemRequest;
import com.autoflex.backend.dto.ProductMaterialItemResponse;
import com.autoflex.backend.exception.NotFoundException;
import com.autoflex.backend.model.Product;
import com.autoflex.backend.model.ProductMaterial;
import com.autoflex.backend.model.RawMaterial;
import com.autoflex.backend.repository.ProductMaterialRepository;
import com.autoflex.backend.repository.ProductRepository;
import com.autoflex.backend.repository.RawMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductMaterialService {

    private final ProductRepository productRepo;
    private final RawMaterialRepository rawMaterialRepo;
    private final ProductMaterialRepository productMaterialRepo;

    @Transactional
    public List<ProductMaterialItemResponse> replaceMaterials(UUID productId, List<ProductMaterialItemRequest> items) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found"));

        // Remove o BOM atual e recria
        productMaterialRepo.deleteByProductId(productId);

        List<ProductMaterial> saved = items.stream().map(item -> {
            RawMaterial rm = rawMaterialRepo.findById(item.rawMaterialId())
                    .orElseThrow(() -> new NotFoundException("Raw material not found: " + item.rawMaterialId()));

            ProductMaterial pm = ProductMaterial.builder()
                    .product(product)
                    .rawMaterial(rm)
                    .requiredQuantity(item.requiredQuantity())
                    .build();

            return productMaterialRepo.save(pm);
        }).toList();

        return saved.stream().map(this::toResponse).toList();
    }

    public List<ProductMaterialItemResponse> listMaterials(UUID productId) {
        // valida se produto existe (para retornar 404 se não existir)
        if (!productRepo.existsById(productId)) throw new NotFoundException("Product not found");

        return productMaterialRepo.findByProductId(productId).stream()
                .map(this::toResponse)
                .toList();
    }

    private ProductMaterialItemResponse toResponse(ProductMaterial pm) {
        return new ProductMaterialItemResponse(
                pm.getId(),
                pm.getRawMaterial().getId(),
                pm.getRawMaterial().getCode(),
                pm.getRawMaterial().getName(),
                pm.getRequiredQuantity()
        );
    }
}
