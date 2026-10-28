import { IsOptional, IsString, IsNumber, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class RoomQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  floor?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sharing?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsIn(['roomNumber', 'floor', 'rent', 'occupancy', 'createdAt'])
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;
}
