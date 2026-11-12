import { IsNotEmpty, IsString } from 'class-validator';

export class SendNotificationDto {
  @IsString()
  @IsNotEmpty()
  channel: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
