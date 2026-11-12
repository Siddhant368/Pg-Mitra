import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class StudentQueryDto {
  @IsOptional()
  @IsString()
  pgId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  rentStatus?: string;

  @IsOptional()
  @IsString()
  verificationStatus?: string;

  @IsOptional()
  @IsString()
  accountStatus?: string;

  @IsOptional()
  @IsString()
  quickFilter?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  sortField?: string;

  @IsOptional()
  @IsString()
  sortOrder?: string;
}
