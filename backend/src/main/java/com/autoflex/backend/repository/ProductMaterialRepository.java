package com.autoflex.backend.repository;

import com.autoflex.backend.model.ProductMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface ProductMaterialRepository extends JpaRepository<ProductMaterial, UUID> {

    List<ProductMaterial> findByProductId(UUID productId);

    @Transactional
    void deleteByProductId(UUID productId);

    @Query("""
        select pm from ProductMaterial pm
        join fetch pm.product p
        join fetch pm.rawMaterial rm
    """)
    List<ProductMaterial> findAllWithProductAndRawMaterial();
}
