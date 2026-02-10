package com.autoflex.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "product_materials",
        uniqueConstraints = @UniqueConstraint(name = "uq_product_material", columnNames = {"product_id", "raw_material_id"}))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ProductMaterial {

    @Id
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "raw_material_id", nullable = false)
    private RawMaterial rawMaterial;

    @Column(name = "required_quantity", nullable = false, precision = 14, scale = 3)
    private BigDecimal requiredQuantity;

    @PrePersist
    public void prePersist() {
        if (id == null) id = UUID.randomUUID();
    }
}
