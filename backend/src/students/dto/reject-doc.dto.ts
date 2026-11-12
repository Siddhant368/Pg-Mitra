import { IsNotEmpty, IsString } from 'class-validator';

export class RejectDocDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}
