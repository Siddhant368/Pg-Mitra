import { IsArray, IsOptional, IsString } from 'class-validator';

export class BulkActionDto {
  @IsArray()
  @IsString({ each: true })
  studentIds: string[];

  @IsOptional()
  @IsString()
  accountStatus?: string;
}
