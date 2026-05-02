package com.stockflow_mvp.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(
        uniqueConstraints = @UniqueConstraint(columnNames = {"sku", "organization_id"})
)
public class Product extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String sku;

    @Builder.Default
    @Column(nullable = false)
    private Integer quantity = 0;

    private Double costPrice;
    private Double sellingPrice;

    private Integer lowStockThreshold;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private Organization organization;
}
