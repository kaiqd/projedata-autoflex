package com.autoflex.backend.service;

import com.autoflex.backend.dto.ProductionSuggestionItemResponse;
import com.autoflex.backend.dto.ProductionSuggestionResponse;
import com.autoflex.backend.model.Product;
import com.autoflex.backend.model.ProductMaterial;
import com.autoflex.backend.repository.ProductMaterialRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ProductionSuggestionService {

    private final ProductMaterialRepository productMaterialRepo;

    public ProductionSuggestionResponse suggest() {
        List<ProductMaterial> all = productMaterialRepo.findAllWithProductAndRawMaterial();

        // Agrupa BOM por produto
        Map<UUID, List<ProductMaterial>> bomByProduct = new HashMap<>();
        for (ProductMaterial pm : all) {
            bomByProduct.computeIfAbsent(pm.getProduct().getId(), k -> new ArrayList<>()).add(pm);
        }

        // Lista de produtos únicos e ordena por maior preço
        List<Product> products = bomByProduct.values().stream()
                .map(list -> list.get(0).getProduct())
                .sorted(Comparator.comparing(Product::getPrice).reversed())
                .toList();

        // Estoque "disponível" para simulação (não altera DB)
        Map<UUID, BigDecimal> availableStock = new HashMap<>();
        for (ProductMaterial pm : all) {
            availableStock.putIfAbsent(pm.getRawMaterial().getId(), pm.getRawMaterial().getStockQuantity());
        }

        List<ProductionSuggestionItemResponse> items = new ArrayList<>();
        BigDecimal grandTotal = BigDecimal.ZERO;

        for (Product product : products) {
            List<ProductMaterial> bom = bomByProduct.get(product.getId());
            if (bom == null || bom.isEmpty()) continue;

            int maxPossible = maxProducibleUnits(bom, availableStock);
            if (maxPossible <= 0) continue;

            // Consome estoque "virtual"
            consumeStock(bom, availableStock, maxPossible);

            BigDecimal totalValue = product.getPrice().multiply(BigDecimal.valueOf(maxPossible));
            grandTotal = grandTotal.add(totalValue);

            items.add(new ProductionSuggestionItemResponse(
                    product.getId(),
                    product.getCode(),
                    product.getName(),
                    product.getPrice(),
                    maxPossible,
                    totalValue
            ));
        }

        return new ProductionSuggestionResponse(items, grandTotal);
    }

    private int maxProducibleUnits(List<ProductMaterial> bom, Map<UUID, BigDecimal> stock) {
        int max = Integer.MAX_VALUE;

        for (ProductMaterial pm : bom) {
            BigDecimal available = stock.getOrDefault(pm.getRawMaterial().getId(), BigDecimal.ZERO);
            BigDecimal required = pm.getRequiredQuantity();

            if (required == null || required.compareTo(BigDecimal.ZERO) <= 0) return 0;

            // floor(available / required)
            int possible = available.divide(required, 0, RoundingMode.FLOOR).intValueExact();
            max = Math.min(max, possible);
        }

        return max == Integer.MAX_VALUE ? 0 : max;
    }

    private void consumeStock(List<ProductMaterial> bom, Map<UUID, BigDecimal> stock, int units) {
        BigDecimal u = BigDecimal.valueOf(units);
        for (ProductMaterial pm : bom) {
            UUID rmId = pm.getRawMaterial().getId();
            BigDecimal available = stock.getOrDefault(rmId, BigDecimal.ZERO);
            BigDecimal requiredTotal = pm.getRequiredQuantity().multiply(u);
            stock.put(rmId, available.subtract(requiredTotal));
        }
    }
}
