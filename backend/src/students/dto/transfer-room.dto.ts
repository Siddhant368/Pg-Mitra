import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class TransferRoomDto {
  @IsString()
  @IsNotEmpty()
  pgId: string;

  @IsString()
  @IsNotEmpty()
  pgName: string;

  @IsString()
  @IsNotEmpty()
  roomNumber: string;

  @IsString()
  @IsNotEmpty()
  bedNumber: string;

  @IsOptional()
  @IsNumber()
  newRent?: number;

  @IsOptional()
  @IsString()
  building?: string;

  @IsOptional()
  @IsString()
  floor?: string;
}
