package com.autoflex.backend.repository;

import com.autoflex.backend.model.RawMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RawMaterialRepository extends JpaRepository<RawMaterial, UUID> {
    boolean existsByCode(String code);
}
