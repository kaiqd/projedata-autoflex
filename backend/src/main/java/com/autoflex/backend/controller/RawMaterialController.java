package com.autoflex.backend.controller;

import com.autoflex.backend.dto.RawMaterialRequest;
import com.autoflex.backend.dto.RawMaterialResponse;
import com.autoflex.backend.service.RawMaterialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/raw-materials")
@RequiredArgsConstructor
public class RawMaterialController {

    private final RawMaterialService service;

    @PostMapping
    public RawMaterialResponse create(@RequestBody @Valid RawMaterialRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<RawMaterialResponse> list() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public RawMaterialResponse get(@PathVariable UUID id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public RawMaterialResponse update(@PathVariable UUID id, @RequestBody @Valid RawMaterialRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
