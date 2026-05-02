package com.stockflow_mvp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductResponse {

    private Long id;
    private String name;
    private String sku;
    private Integer quantity;
    private Double sellingPrice;
}
