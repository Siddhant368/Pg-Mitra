import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsArray, Min } from 'class-validator';
import { PgType } from '../schemas/pg.schema.js';

export class CreatePgDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  pincode: string;

  @IsString()
  @IsNotEmpty()
  contactPhone: string;

  @IsEnum(PgType)
  type: PgType;

  @IsNumber()
  @Min(0)
  totalRooms: number;

  @IsNumber()
  @Min(0)
  totalBeds: number;

  @IsString()
  @IsOptional()
  rentRange?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];
}
