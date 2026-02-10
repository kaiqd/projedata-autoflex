package com.autoflex.backend.repository;

import com.autoflex.backend.model.ProductMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProductMaterialRepository extends JpaRepository<ProductMaterial, UUID> {
    List<ProductMaterial> findByProductId(UUID productId);
    void deleteByProductId(UUID productId);
}
