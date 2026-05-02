import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AdjustStockDto {
  @IsInt({ message: 'Adjustment must be an integer (positive or negative)' })
  @IsNotEmpty({ message: 'Adjustment value is required' })
  adjustment: number; // +N to add, -N to subtract

  @IsString()
  @IsOptional()
  note?: string;
}
