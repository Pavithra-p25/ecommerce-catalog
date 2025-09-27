package com.productcatalog.repository;

import com.productcatalog.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Find products by category
    Page<Product> findByCategory(String category, Pageable pageable);
    
    // Find products by name containing (case insensitive)
    Page<Product> findByProductNameContainingIgnoreCase(String productName, Pageable pageable);
    
    // Find products by category and name containing
    Page<Product> findByCategoryAndProductNameContainingIgnoreCase(
        String category, String productName, Pageable pageable);
    
    // Custom query for advanced search
    @Query("SELECT p FROM Product p WHERE " +
           "(:category is null OR p.category = :category) AND " +
           "(:search is null OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> findProductsWithFilters(
        @Param("category") String category,
        @Param("search") String search,
        Pageable pageable);
    
    // Count products by category
    long countByCategory(String category);
}
