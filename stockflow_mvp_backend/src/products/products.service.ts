import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserWithOrg } from '../common/decorators/current-user.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { Product } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Determines if a product is low stock.
   * Uses product's own threshold first, falls back to org default.
   */
  private isLowStock(product: Product, orgDefault: number): boolean {
    const threshold = product.lowStockThreshold ?? orgDefault;
    return product.quantity <= threshold;
  }

  private toResponse(product: Product, orgDefault: number): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      description: product.description,
      quantity: product.quantity,
      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      lowStockThreshold: product.lowStockThreshold,
      isLowStock: this.isLowStock(product, orgDefault),
      organizationId: product.organizationId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  /**
   * Fetch a product by id and verify it belongs to the caller's org.
   */
  private async findAndVerifyOwnership(
    productId: number,
    organizationId: number,
  ): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.organizationId !== organizationId) {
      throw new ForbiddenException(
        'You do not have permission to access this product',
      );
    }

    return product;
  }

  // ─── CRUD ────────────────────────────────────────────────────────────────────

  async create(
    dto: CreateProductDto,
    user: UserWithOrg,
  ): Promise<ProductResponseDto> {
    const orgId = user.organizationId;

    // Friendly duplicate SKU check before hitting the DB unique constraint
    const existing = await this.prisma.product.findUnique({
      where: { sku_organizationId: { sku: dto.sku, organizationId: orgId } },
    });
    if (existing) {
      throw new BadRequestException(
        `A product with SKU '${dto.sku}' already exists in your organization`,
      );
    }

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        sku: dto.sku,
        description: dto.description,
        quantity: dto.quantity,
        costPrice: dto.costPrice,
        sellingPrice: dto.sellingPrice,
        lowStockThreshold: dto.lowStockThreshold,
        organizationId: orgId,
      },
    });

    return this.toResponse(
      product,
      user.organization.defaultLowStockThreshold,
    );
  }

  async findAll(user: UserWithOrg): Promise<ProductResponseDto[]> {
    const products = await this.prisma.product.findMany({
      where: { organizationId: user.organizationId },
      orderBy: { createdAt: 'desc' },
    });

    return products.map((p) =>
      this.toResponse(p, user.organization.defaultLowStockThreshold),
    );
  }

  async findOne(id: number, user: UserWithOrg): Promise<ProductResponseDto> {
    const product = await this.findAndVerifyOwnership(id, user.organizationId);
    return this.toResponse(product, user.organization.defaultLowStockThreshold);
  }

  async update(
    id: number,
    dto: UpdateProductDto,
    user: UserWithOrg,
  ): Promise<ProductResponseDto> {
    const product = await this.findAndVerifyOwnership(id, user.organizationId);

    // If SKU is changing, check the new one isn't already taken in this org
    if (dto.sku && dto.sku !== product.sku) {
      const skuTaken = await this.prisma.product.findUnique({
        where: {
          sku_organizationId: {
            sku: dto.sku,
            organizationId: user.organizationId,
          },
        },
      });
      if (skuTaken) {
        throw new BadRequestException(
          `A product with SKU '${dto.sku}' already exists in your organization`,
        );
      }
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        name: dto.name,
        sku: dto.sku,
        description: dto.description,
        quantity: dto.quantity,
        costPrice: dto.costPrice,
        sellingPrice: dto.sellingPrice,
        lowStockThreshold: dto.lowStockThreshold,
      },
    });

    return this.toResponse(
      updated,
      user.organization.defaultLowStockThreshold,
    );
  }

  async remove(id: number, user: UserWithOrg): Promise<void> {
    await this.findAndVerifyOwnership(id, user.organizationId);
    await this.prisma.product.delete({ where: { id } });
  }

  async adjustStock(
    id: number,
    dto: AdjustStockDto,
    user: UserWithOrg,
  ): Promise<ProductResponseDto> {
    const product = await this.findAndVerifyOwnership(id, user.organizationId);

    const newQuantity = product.quantity + dto.adjustment;

    if (newQuantity < 0) {
      throw new BadRequestException(
        `Adjustment would result in negative stock (current: ${product.quantity}, adjustment: ${dto.adjustment})`,
      );
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: { quantity: newQuantity },
    });

    return this.toResponse(
      updated,
      user.organization.defaultLowStockThreshold,
    );
  }
}
