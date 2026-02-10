package com.autoflex.backend.repository;

import com.autoflex.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    boolean existsByCode(String code);
    Optional<Product> findByCode(String code);
}
