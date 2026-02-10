package com.autoflex.backend.service;

import com.autoflex.backend.dto.ProductionSuggestionResponse;
import com.autoflex.backend.model.Product;
import com.autoflex.backend.model.ProductMaterial;
import com.autoflex.backend.model.RawMaterial;
import com.autoflex.backend.repository.ProductMaterialRepository;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductionSuggestionServiceTest {

    @Test
    void shouldSuggestQuantityAndTotalForSingleProduct() {
        // Arrange 
        ProductMaterialRepository repo = mock(ProductMaterialRepository.class);
        ProductionSuggestionService service = new ProductionSuggestionService(repo);

        Product product = Product.builder()
                .id(UUID.randomUUID())
                .code("P100")
                .name("Steel Table")
                .price(new BigDecimal("350.00"))
                .build();

        RawMaterial rm = RawMaterial.builder()
                .id(UUID.randomUUID())
                .code("RM010")
                .name("Steel Sheet")
                .stockQuantity(new BigDecimal("200.000"))
                .build();

        ProductMaterial pm = ProductMaterial.builder()
                .id(UUID.randomUUID())
                .product(product)
                .rawMaterial(rm)
                .requiredQuantity(new BigDecimal("10.000"))
                .build();

        when(repo.findAllWithProductAndRawMaterial()).thenReturn(List.of(pm));

        // Act 
        ProductionSuggestionResponse resp = service.suggest();

        // Assert
        assertEquals(1, resp.items().size());
        assertEquals(new BigDecimal("7000.00"), resp.totalValue());

        var item = resp.items().get(0);
        assertEquals("P100", item.productCode());
        assertEquals(20, item.suggestedQuantity());
        assertEquals(new BigDecimal("7000.00"), item.totalValue());
    }

    @Test
    void shouldPrioritizeHigherPriceProductsWhenStockIsShared() {
        // Arrange
        ProductMaterialRepository repo = mock(ProductMaterialRepository.class);
        ProductionSuggestionService service = new ProductionSuggestionService(repo);

        RawMaterial sharedRm = RawMaterial.builder()
                .id(UUID.randomUUID())
                .code("RM010")
                .name("Steel Sheet")
                .stockQuantity(new BigDecimal("200.000"))
                .build();

        Product premium = Product.builder()
                .id(UUID.randomUUID())
                .code("P200")
                .name("Premium Table")
                .price(new BigDecimal("500.00"))
                .build();

        Product regular = Product.builder()
                .id(UUID.randomUUID())
                .code("P100")
                .name("Regular Table")
                .price(new BigDecimal("350.00"))
                .build();

        // Produto premium precisa de 20 unidades → pode produzir 10 e consome todo o estoque
        ProductMaterial premiumPm = ProductMaterial.builder()
                .id(UUID.randomUUID())
                .product(premium)
                .rawMaterial(sharedRm)
                .requiredQuantity(new BigDecimal("20.000"))
                .build();

        // Produto regular precisaria de 10 → produziria 20,
        // mas não deve ser sugerido porque o estoque já foi consumido pelo premium
        ProductMaterial regularPm = ProductMaterial.builder()
                .id(UUID.randomUUID())
                .product(regular)
                .rawMaterial(sharedRm)
                .requiredQuantity(new BigDecimal("10.000"))
                .build();

        when(repo.findAllWithProductAndRawMaterial()).thenReturn(List.of(premiumPm, regularPm));

        // Act 
        ProductionSuggestionResponse resp = service.suggest();

        // Assert 
        assertEquals(1, resp.items().size());
        assertEquals("P200", resp.items().get(0).productCode());
        assertEquals(10, resp.items().get(0).suggestedQuantity());
        assertEquals(new BigDecimal("5000.00"), resp.totalValue());
    }

    @Test
    void shouldRespectLimitingRawMaterialInBom() {
        // Arrange
        ProductMaterialRepository repo = mock(ProductMaterialRepository.class);
        ProductionSuggestionService service = new ProductionSuggestionService(repo);

        Product product = Product.builder()
                .id(UUID.randomUUID())
                .code("P300")
                .name("Multi Material Product")
                .price(new BigDecimal("100.00"))
                .build();

        RawMaterial rm1 = RawMaterial.builder()
                .id(UUID.randomUUID())
                .code("RM1")
                .name("Material 1")
                .stockQuantity(new BigDecimal("100.000")) // permite 10 unidades (100 / 10)
                .build();

        RawMaterial rm2 = RawMaterial.builder()
                .id(UUID.randomUUID())
                .code("RM2")
                .name("Material 2")
                .stockQuantity(new BigDecimal("15.000"))  // permite 15 unidades (15 / 1)
                .build();

        ProductMaterial pm1 = ProductMaterial.builder()
                .id(UUID.randomUUID())
                .product(product)
                .rawMaterial(rm1)
                .requiredQuantity(new BigDecimal("10.000"))
                .build();

        ProductMaterial pm2 = ProductMaterial.builder()
                .id(UUID.randomUUID())
                .product(product)
                .rawMaterial(rm2)
                .requiredQuantity(new BigDecimal("1.000"))
                .build();

        when(repo.findAllWithProductAndRawMaterial()).thenReturn(List.of(pm1, pm2));

        // Act 
        ProductionSuggestionResponse resp = service.suggest();

        // Assert
        assertEquals(1, resp.items().size());
        assertEquals(10, resp.items().get(0).suggestedQuantity(),
                "A matéria-prima RM1 é o fator limitante");
        assertEquals(new BigDecimal("1000.00"), resp.totalValue());
    }

    @Test
    void shouldReturnEmptyWhenThereAreNoAssociations() {
        // Arrange
        ProductMaterialRepository repo = mock(ProductMaterialRepository.class);
        ProductionSuggestionService service = new ProductionSuggestionService(repo);

        when(repo.findAllWithProductAndRawMaterial()).thenReturn(List.of());

        // Act
        ProductionSuggestionResponse resp = service.suggest();

        // Assert
        assertNotNull(resp);
        assertTrue(resp.items().isEmpty());
        assertEquals(new BigDecimal("0"), resp.totalValue());
    }

    @Test
    void shouldNotSuggestProductWhenStockIsInsufficient() {
        // Arrange
        ProductMaterialRepository repo = mock(ProductMaterialRepository.class);
        ProductionSuggestionService service = new ProductionSuggestionService(repo);

        Product product = Product.builder()
                .id(UUID.randomUUID())
                .code("P500")
                .name("Heavy Product")
                .price(new BigDecimal("100.00"))
                .build();

        RawMaterial rm = RawMaterial.builder()
                .id(UUID.randomUUID())
                .code("RM500")
                .name("Rare Material")
                .stockQuantity(new BigDecimal("5.000"))
                .build();

        ProductMaterial pm = ProductMaterial.builder()
                .id(UUID.randomUUID())
                .product(product)
                .rawMaterial(rm)
                .requiredQuantity(new BigDecimal("10.000")) // precisa de 10, mas só tem 5
                .build();

        when(repo.findAllWithProductAndRawMaterial()).thenReturn(List.of(pm));

        // Act
        ProductionSuggestionResponse resp = service.suggest();

        // Assert
        assertTrue(resp.items().isEmpty());
        assertEquals(new BigDecimal("0"), resp.totalValue());
    }

    @Test
    void shouldIgnoreInvalidRequiredQuantityZero() {
        // Arrange
        ProductMaterialRepository repo = mock(ProductMaterialRepository.class);
        ProductionSuggestionService service = new ProductionSuggestionService(repo);

        Product product = Product.builder()
                .id(UUID.randomUUID())
                .code("P600")
                .name("Invalid BOM Product")
                .price(new BigDecimal("100.00"))
                .build();

        RawMaterial rm = RawMaterial.builder()
                .id(UUID.randomUUID())
                .code("RM600")
                .name("Material")
                .stockQuantity(new BigDecimal("100.000"))
                .build();

        ProductMaterial pm = ProductMaterial.builder()
                .id(UUID.randomUUID())
                .product(product)
                .rawMaterial(rm)
                .requiredQuantity(new BigDecimal("0.000")) // inválido
                .build();

        when(repo.findAllWithProductAndRawMaterial()).thenReturn(List.of(pm));

        // Act
        ProductionSuggestionResponse resp = service.suggest();

        // Assert
        assertTrue(resp.items().isEmpty(), "requiredQuantity=0 should not generate a suggestion");
        assertEquals(new BigDecimal("0"), resp.totalValue());
    }

    @Test
    void shouldSuggestMultipleProductsWhenStocksDoNotConflict() {
        // Arrange
        ProductMaterialRepository repo = mock(ProductMaterialRepository.class);
        ProductionSuggestionService service = new ProductionSuggestionService(repo);

        // Produto A usa RM-A
        RawMaterial rmA = RawMaterial.builder()
                .id(UUID.randomUUID())
                .code("RM-A")
                .name("Material A")
                .stockQuantity(new BigDecimal("50.000"))
                .build();

        Product productA = Product.builder()
                .id(UUID.randomUUID())
                .code("P-A")
                .name("Product A")
                .price(new BigDecimal("100.00"))
                .build();

        ProductMaterial pmA = ProductMaterial.builder()
                .id(UUID.randomUUID())
                .product(productA)
                .rawMaterial(rmA)
                .requiredQuantity(new BigDecimal("10.000")) // 50/10 = 5
                .build();

        // Produto B usa RM-B
        RawMaterial rmB = RawMaterial.builder()
                .id(UUID.randomUUID())
                .code("RM-B")
                .name("Material B")
                .stockQuantity(new BigDecimal("21.000"))
                .build();

        Product productB = Product.builder()
                .id(UUID.randomUUID())
                .code("P-B")
                .name("Product B")
                .price(new BigDecimal("80.00"))
                .build();

                ProductMaterial pmB = ProductMaterial.builder()
                .id(UUID.randomUUID())
                .product(productB)
                .rawMaterial(rmB)
                .requiredQuantity(new BigDecimal("7.000")) // 21/7 = 3
                .build();

        when(repo.findAllWithProductAndRawMaterial()).thenReturn(List.of(pmA, pmB));

        // Act
        ProductionSuggestionResponse resp = service.suggest();

        // Assert
        assertEquals(2, resp.items().size(), "Both products should be suggested since stocks don't overlap");

        // Total esperado: A => 5*100 = 500; B => 3*80 = 240; total=740
        assertEquals(new BigDecimal("740.00"), resp.totalValue());
    }
}
