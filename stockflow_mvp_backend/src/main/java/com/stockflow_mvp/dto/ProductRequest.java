package com.stockflow_mvp.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class ProductRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "SKU is required")
    private String sku;

    @NotNull(message = "Quantity is required")
    private Integer quantity;

    private Double costPrice;
    private Double sellingPrice;
    private Integer lowStockThreshold;
}