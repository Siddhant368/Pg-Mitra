import { IsEnum } from 'class-validator';
import { DemoRequestStatus } from '../schemas/demo-request.schema.js';

export class UpdateDemoRequestStatusDto {
  @IsEnum(DemoRequestStatus)
  status: DemoRequestStatus;
}
