package com.autoflex.backend.service;

import com.autoflex.backend.dto.ProductRequest;
import com.autoflex.backend.dto.ProductResponse;
import com.autoflex.backend.exception.BadRequestException;
import com.autoflex.backend.exception.NotFoundException;
import com.autoflex.backend.model.Product;
import com.autoflex.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repo;

    public ProductResponse create(ProductRequest req) {
        if (repo.existsByCode(req.code())) {
            throw new BadRequestException("Product code already exists");
        }
        Product p = Product.builder()
                .code(req.code().trim())
                .name(req.name().trim())
                .price(req.price())
                .build();
        return toResponse(repo.save(p));
    }

    public List<ProductResponse> findAll() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public ProductResponse findById(UUID id) {
        return toResponse(repo.findById(id).orElseThrow(() -> new NotFoundException("Product not found")));
    }

    public ProductResponse update(UUID id, ProductRequest req) {
        Product p = repo.findById(id).orElseThrow(() -> new NotFoundException("Product not found"));

        // Se trocar o code, valida duplicidade
        if (!p.getCode().equals(req.code()) && repo.existsByCode(req.code())) {
            throw new BadRequestException("Product code already exists");
        }

        p.setCode(req.code().trim());
        p.setName(req.name().trim());
        p.setPrice(req.price());
        return toResponse(repo.save(p));
    }

    public void delete(UUID id) {
        if (!repo.existsById(id)) throw new NotFoundException("Product not found");
        repo.deleteById(id);
    }

    private ProductResponse toResponse(Product p) {
        return new ProductResponse(p.getId(), p.getCode(), p.getName(), p.getPrice());
    }
}
