import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserWithOrg } from '../common/decorators/current-user.decorator';
import {
  DashboardResponseDto,
  LowStockItemDto,
} from './dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(user: UserWithOrg): Promise<DashboardResponseDto> {
    const orgDefault = user.organization.defaultLowStockThreshold;

    const products = await this.prisma.product.findMany({
      where: { organizationId: user.organizationId },
    });

    const totalProducts = products.length;

    // Sum of all quantities across the org
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

    // A product is low stock if quantity <= its threshold (or org default if null)
    const lowStockItems: LowStockItemDto[] = products
      .filter((p) => {
        const threshold = p.lowStockThreshold ?? orgDefault;
        return p.quantity <= threshold;
      })
      .map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        quantity: p.quantity,
        lowStockThreshold: p.lowStockThreshold ?? orgDefault,
      }));

    return { totalProducts, totalQuantity, lowStockItems };
  }
}
