import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { UserWithOrg } from '../common/decorators/current-user.decorator';
import { ApiResponse } from '../common/dto/api-response.dto';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';

@UseGuards(JwtGuard)          // every route in this controller requires a valid JWT
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @Body() dto: CreateProductDto,
    @CurrentUser() user: UserWithOrg,
  ) {
    const data = await this.productsService.create(dto, user);
    return ApiResponse.ok('Product created successfully', data);
  }

  @Get()
  async findAll(@CurrentUser() user: UserWithOrg) {
    const data = await this.productsService.findAll(user);
    return ApiResponse.ok('Products fetched successfully', data);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserWithOrg,
  ) {
    const data = await this.productsService.findOne(id, user);
    return ApiResponse.ok('Product fetched successfully', data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: UserWithOrg,
  ) {
    const data = await this.productsService.update(id, dto, user);
    return ApiResponse.ok('Product updated successfully', data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: UserWithOrg,
  ) {
    await this.productsService.remove(id, user);
    return ApiResponse.ok('Product deleted successfully');
  }

  @Patch(':id/adjust-stock')
  async adjustStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdjustStockDto,
    @CurrentUser() user: UserWithOrg,
  ) {
    const data = await this.productsService.adjustStock(id, dto, user);
    return ApiResponse.ok('Stock adjusted successfully', data);
  }
}
