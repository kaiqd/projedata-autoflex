package com.autoflex.backend.service;

import com.autoflex.backend.dto.RawMaterialRequest;
import com.autoflex.backend.dto.RawMaterialResponse;
import com.autoflex.backend.exception.BadRequestException;
import com.autoflex.backend.exception.NotFoundException;
import com.autoflex.backend.model.RawMaterial;
import com.autoflex.backend.repository.RawMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RawMaterialService {

    private final RawMaterialRepository repo;

    public RawMaterialResponse create(RawMaterialRequest req) {
        if (repo.existsByCode(req.code())) {
            throw new BadRequestException("Raw material code already exists");
        }

        RawMaterial rm = RawMaterial.builder()
                .code(req.code().trim())
                .name(req.name().trim())
                .stockQuantity(req.stockQuantity())
                .build();

        return toResponse(repo.save(rm));
    }

    public List<RawMaterialResponse> findAll() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }

    public RawMaterialResponse findById(UUID id) {
        RawMaterial rm = repo.findById(id).orElseThrow(() -> new NotFoundException("Raw material not found"));
        return toResponse(rm);
    }

    public RawMaterialResponse update(UUID id, RawMaterialRequest req) {
        RawMaterial rm = repo.findById(id).orElseThrow(() -> new NotFoundException("Raw material not found"));

        if (!rm.getCode().equals(req.code()) && repo.existsByCode(req.code())) {
            throw new BadRequestException("Raw material code already exists");
        }

        rm.setCode(req.code().trim());
        rm.setName(req.name().trim());
        rm.setStockQuantity(req.stockQuantity());

        return toResponse(repo.save(rm));
    }

    public void delete(UUID id) {
        if (!repo.existsById(id)) throw new NotFoundException("Raw material not found");
        repo.deleteById(id);
    }

    private RawMaterialResponse toResponse(RawMaterial rm) {
        return new RawMaterialResponse(rm.getId(), rm.getCode(), rm.getName(), rm.getStockQuantity());
    }
}
