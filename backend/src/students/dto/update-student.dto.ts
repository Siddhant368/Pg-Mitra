import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentDto } from './create-student.dto.js';
import { IsOptional, IsString } from 'class-validator';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  _id?: string;

  @IsOptional()
  @IsString()
  createdAt?: string;

  @IsOptional()
  @IsString()
  updatedAt?: string;
}
