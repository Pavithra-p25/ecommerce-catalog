package com.productcatalog.service;

import com.productcatalog.dto.ProductRequest;
import com.productcatalog.dto.ProductResponse;
import com.productcatalog.entity.Product;
import com.productcatalog.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

public class ProductServiceTest {
    
    @Mock
    private ProductRepository productRepository;
    
    @InjectMocks
    private ProductService productService;
    
    private Product testProduct;
    private ProductRequest testProductRequest;
    
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        testProduct = new Product(
            "Test Product",
            "Electronics",
            "Test Description",
            new BigDecimal("99.99"),
            50,
            "Test Supplier"
        );
        testProduct.setId(1L);
        
        testProductRequest = new ProductRequest(
            "Test Product",
            "Electronics", 
            "Test Description",
            new BigDecimal("99.99"),
            50,
            "Test Supplier"
        );
    }
    
    @Test
    void testGetAllProducts() {
        // Given
        Page<Product> productPage = new PageImpl<>(Arrays.asList(testProduct));
        Pageable pageable = PageRequest.of(0, 10);
        
        when(productRepository.findProductsWithFilters(any(), any(), any(Pageable.class)))
            .thenReturn(productPage);
        
        // When
        Page<ProductResponse> result = productService.getAllProducts("", "", 0, 10, "id", "asc");
        
        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Test Product", result.getContent().get(0).getProductName());
    }
    
    @Test
    void testGetProductById() {
        // Given
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        
        // When
        ProductResponse result = productService.getProductById(1L);
        
        // Then
        assertNotNull(result);
        assertEquals("Test Product", result.getProductName());
        assertEquals("Electronics", result.getCategory());
    }
    
    @Test
    void testGetProductByIdNotFound() {
        // Given
        when(productRepository.findById(anyLong())).thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(RuntimeException.class, () -> {
            productService.getProductById(999L);
        });
    }
    
    @Test
    void testCreateProduct() {
        // Given
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);
        
        // When
        ProductResponse result = productService.createProduct(testProductRequest);
        
        // Then
        assertNotNull(result);
        assertEquals("Test Product", result.getProductName());
        verify(productRepository, times(1)).save(any(Product.class));
    }
    
    @Test
    void testUpdateProduct() {
        // Given
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);
        
        // When
        ProductResponse result = productService.updateProduct(1L, testProductRequest);
        
        // Then
        assertNotNull(result);
        assertEquals("Test Product", result.getProductName());
        verify(productRepository, times(1)).save(testProduct);
    }
    
    @Test
    void testDeleteProduct() {
        // Given
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        doNothing().when(productRepository).delete(testProduct);
        
        // When
        productService.deleteProduct(1L);
        
        // Then
        verify(productRepository, times(1)).delete(testProduct);
    }
    
    @Test
    void testDeleteProductNotFound() {
        // Given
        when(productRepository.findById(anyLong())).thenReturn(Optional.empty());
        
        // When & Then
        assertThrows(RuntimeException.class, () -> {
            productService.deleteProduct(999L);
        });
    }
}
