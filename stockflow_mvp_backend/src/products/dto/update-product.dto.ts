import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

// All fields from CreateProductDto become optional — no need to repeat validations
export class UpdateProductDto extends PartialType(CreateProductDto) {}
