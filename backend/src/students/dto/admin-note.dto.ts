import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddAdminNoteDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  priority?: string;
}
