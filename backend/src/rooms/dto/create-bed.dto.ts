import {
  IsOptional,
  IsNumber,
  IsString,
  Min,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BedStatus } from '../schemas/bed.schema.js';

export class CreateBedDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  bedNumber?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(50)
  label?: string;

  @IsOptional()
  @IsEnum(BedStatus)
  status?: BedStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  monthlyRent?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  tenantName?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  tenantPhone?: string;
}
