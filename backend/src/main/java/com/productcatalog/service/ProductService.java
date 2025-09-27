package com.productcatalog.service;

import com.productcatalog.dto.ProductRequest;
import com.productcatalog.dto.ProductResponse;
import com.productcatalog.entity.Product;
import com.productcatalog.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public Page<ProductResponse> getAllProducts(String search, String category, 
                                              int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Product> products = productRepository.findProductsWithFilters(category, search, pageable);
        
        return products.map(ProductResponse::new);
    }
    
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return new ProductResponse(product);
    }
    
    public ProductResponse createProduct(ProductRequest productRequest) {
        Product product = new Product(
            productRequest.getProductName(),
            productRequest.getCategory(),
            productRequest.getDescription(),
            productRequest.getPrice(),
            productRequest.getStockQuantity(),
            productRequest.getSupplier()
        );
        
        Product savedProduct = productRepository.save(product);
        return new ProductResponse(savedProduct);
    }
    
    public ProductResponse updateProduct(Long id, ProductRequest productRequest) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        product.setProductName(productRequest.getProductName());
        product.setCategory(productRequest.getCategory());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setStockQuantity(productRequest.getStockQuantity());
        product.setSupplier(productRequest.getSupplier());
        
        Product updatedProduct = productRepository.save(product);
        return new ProductResponse(updatedProduct);
    }
    
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        productRepository.delete(product);
    }
    
    public boolean existsById(Long id) {
        return productRepository.existsById(id);
    }
    
    public long getTotalCount() {
        return productRepository.count();
    }
    
    public long getCountByCategory(String category) {
        return productRepository.countByCategory(category);
    }
}
