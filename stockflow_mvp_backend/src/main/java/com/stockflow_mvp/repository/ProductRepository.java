package com.stockflow_mvp.repository;

import com.stockflow_mvp.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // Get all products for a specific organization
    List<Product> findByOrganizationId(Long organizationId);

    // Find product by SKU within organization
    Optional<Product> findBySkuAndOrganizationId(String sku, Long organizationId);

    // Low stock query
    List<Product> findByOrganizationIdAndQuantityLessThanEqual(
            Long organizationId,
            Integer threshold
    );
}