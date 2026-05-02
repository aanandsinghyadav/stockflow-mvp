import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateSettingsDto {
  @IsInt({ message: 'Default low stock threshold must be an integer' })
  @Min(0, { message: 'Default low stock threshold cannot be negative' })
  @IsNotEmpty({ message: 'Default low stock threshold is required' })
  defaultLowStockThreshold: number;
}
