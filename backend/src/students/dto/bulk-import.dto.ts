import { IsArray } from 'class-validator';

export class BulkImportDto {
  @IsArray()
  students: any[];
}
