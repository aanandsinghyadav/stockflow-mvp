package com.stockflow_mvp.controller;

import com.stockflow_mvp.dto.ApiResponse;
import com.stockflow_mvp.dto.ProductRequest;
import com.stockflow_mvp.dto.ProductResponse;
import com.stockflow_mvp.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> create(
            @Valid @RequestBody ProductRequest request) {

        ProductResponse data = productService.createProduct(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.<ProductResponse>builder()
                        .success(true)
                        .message("Product created successfully")
                        .data(data)
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAll() {

        List<ProductResponse> data = productService.getAllProducts();

        return ResponseEntity.ok(ApiResponse.<List<ProductResponse>>builder()
                .success(true)
                .message("Products fetched successfully")
                .data(data)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getById(@PathVariable Long id) {

        ProductResponse data = productService.getProductById(id);

        return ResponseEntity.ok(ApiResponse.<ProductResponse>builder()
                .success(true)
                .message("Product fetched successfully")
                .data(data)
                .build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {

        ProductResponse data = productService.updateProduct(id, request);

        return ResponseEntity.ok(ApiResponse.<ProductResponse>builder()
                .success(true)
                .message("Product updated successfully")
                .data(data)
                .build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {

        productService.deleteProduct(id);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .success(true)
                .message("Product deleted successfully")
                .build());
    }
}
