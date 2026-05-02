package com.stockflow_mvp.service;

import com.stockflow_mvp.dto.ProductRequest;
import com.stockflow_mvp.dto.ProductResponse;
import com.stockflow_mvp.entity.Product;
import com.stockflow_mvp.entity.User;
import com.stockflow_mvp.exception.BadRequestException;
import com.stockflow_mvp.exception.ResourceNotFoundException;
import com.stockflow_mvp.exception.UnauthorizedException;
import com.stockflow_mvp.repository.ProductRepository;
import com.stockflow_mvp.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    private void assertOwnership(Product product, User user) {
        if (!product.getOrganization().getId().equals(user.getOrganization().getId())) {
            throw new UnauthorizedException("You are not allowed to access this resource");
        }
    }

    @Override
    public ProductResponse createProduct(ProductRequest request) {

        User currentUser = SecurityUtils.getCurrentUser();

        productRepository.findBySkuAndOrganizationId(request.getSku(), currentUser.getOrganization().getId())
                .ifPresent(existing -> {
                    throw new BadRequestException(
                            "A product with SKU '" + request.getSku() + "' already exists in your organization");
                });

        Product product = Product.builder()
                .name(request.getName())
                .sku(request.getSku())
                .quantity(request.getQuantity())
                .costPrice(request.getCostPrice())
                .sellingPrice(request.getSellingPrice())
                .lowStockThreshold(request.getLowStockThreshold())
                .organization(currentUser.getOrganization())
                .build();

        return mapToResponse(productRepository.save(product));
    }

    @Override
    public List<ProductResponse> getAllProducts() {

        User currentUser = SecurityUtils.getCurrentUser();

        return productRepository.findByOrganizationId(currentUser.getOrganization().getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ProductResponse getProductById(Long id) {

        User currentUser = SecurityUtils.getCurrentUser();

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        assertOwnership(product, currentUser);

        return mapToResponse(product);
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {

        User currentUser = SecurityUtils.getCurrentUser();

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        assertOwnership(product, currentUser);

        if (!product.getSku().equals(request.getSku())) {
            productRepository.findBySkuAndOrganizationId(request.getSku(), currentUser.getOrganization().getId())
                    .ifPresent(existing -> {
                        throw new BadRequestException(
                                "A product with SKU '" + request.getSku() + "' already exists in your organization");
                    });
        }

        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setQuantity(request.getQuantity());
        product.setCostPrice(request.getCostPrice());
        product.setSellingPrice(request.getSellingPrice());
        product.setLowStockThreshold(request.getLowStockThreshold());

        return mapToResponse(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Long id) {

        User currentUser = SecurityUtils.getCurrentUser();

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        assertOwnership(product, currentUser);

        productRepository.delete(product);
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .sku(product.getSku())
                .quantity(product.getQuantity())
                .sellingPrice(product.getSellingPrice())
                .build();
    }
}
