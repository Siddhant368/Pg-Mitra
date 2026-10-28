import { PartialType } from '@nestjs/mapped-types';
import { CreateBedDto } from './create-bed.dto.js';

export class UpdateBedDto extends PartialType(CreateBedDto) {}
