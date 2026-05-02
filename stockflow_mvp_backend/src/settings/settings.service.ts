import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserWithOrg } from '../common/decorators/current-user.decorator';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsResponseDto } from './dto/settings-response.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  getSettings(user: UserWithOrg): SettingsResponseDto {
    // Organization is already loaded on the user by JwtStrategy — no extra DB call needed
    return {
      organizationId: user.organization.id,
      organizationName: user.organization.name,
      defaultLowStockThreshold: user.organization.defaultLowStockThreshold,
    };
  }

  async updateSettings(
    dto: UpdateSettingsDto,
    user: UserWithOrg,
  ): Promise<SettingsResponseDto> {
    const updated = await this.prisma.organization.update({
      where: { id: user.organizationId },
      data: { defaultLowStockThreshold: dto.defaultLowStockThreshold },
    });

    return {
      organizationId: updated.id,
      organizationName: updated.name,
      defaultLowStockThreshold: updated.defaultLowStockThreshold,
    };
  }
}
