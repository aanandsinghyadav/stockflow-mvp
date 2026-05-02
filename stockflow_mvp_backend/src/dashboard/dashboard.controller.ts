import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserWithOrg } from '../common/decorators/current-user.decorator';
import { ApiResponse } from '../common/dto/api-response.dto';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getSummary(@CurrentUser() user: UserWithOrg) {
    const data = await this.dashboardService.getSummary(user);
    return ApiResponse.ok('Dashboard data fetched successfully', data);
  }
}
