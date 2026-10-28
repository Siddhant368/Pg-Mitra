import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  Max,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { RoomType, BathroomType, FurnishingType } from '../schemas/room.schema.js';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MaxLength(50)
  roomNumber: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-5)
  @Max(100)
  floor?: number;

  @IsOptional()
  @IsEnum(RoomType)
  roomType?: RoomType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  bedCapacity?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  sharing?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  monthlyRent?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  rentPerBed?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  securityDeposit?: number;

  @IsOptional()
  @IsEnum(BathroomType)
  bathroomType?: BathroomType;

  @IsOptional()
  @IsEnum(FurnishingType)
  furnishing?: FurnishingType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  description?: string;

  // Frontend forms like AddRoomModal pass pgId in body; accepted if present
  @IsOptional()
  @IsString()
  pgId?: string;
}
