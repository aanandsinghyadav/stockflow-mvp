import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserWithOrg } from '../common/decorators/current-user.decorator';
import { ApiResponse } from '../common/dto/api-response.dto';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@UseGuards(JwtGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getSettings(@CurrentUser() user: UserWithOrg) {
    const data = this.settingsService.getSettings(user);
    return ApiResponse.ok('Settings fetched successfully', data);
  }

  @Put()
  async updateSettings(
    @Body() dto: UpdateSettingsDto,
    @CurrentUser() user: UserWithOrg,
  ) {
    const data = await this.settingsService.updateSettings(dto, user);
    return ApiResponse.ok('Settings updated successfully', data);
  }
}
