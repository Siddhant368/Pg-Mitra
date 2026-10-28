import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  Matches,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { PreferredTime } from '../schemas/demo-request.schema.js';

export function IsValidPreferredDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidPreferredDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

          const [yearStr, monthStr, dayStr] = value.split('-');
          const year = parseInt(yearStr, 10);
          const month = parseInt(monthStr, 10);
          const day = parseInt(dayStr, 10);

          // Real calendar date check
          const parsed = new Date(Date.UTC(year, month - 1, day));
          if (
            parsed.getUTCFullYear() !== year ||
            parsed.getUTCMonth() !== month - 1 ||
            parsed.getUTCDate() !== day
          ) {
            return false;
          }

          // Asia/Kolkata timezone calculation for today and today + 14 days
          const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });

          const now = new Date();
          const todayKolkataStr = formatter.format(now); // "YYYY-MM-DD"
          const [tY, tM, tD] = todayKolkataStr.split('-').map((n) => parseInt(n, 10));

          const kolkataTodayUtc = new Date(Date.UTC(tY, tM - 1, tD));
          const kolkataMaxUtc = new Date(Date.UTC(tY, tM - 1, tD + 14));

          return parsed >= kolkataTodayUtc && parsed <= kolkataMaxUtc;
        },
        defaultMessage(_args: ValidationArguments) {
          return 'Please choose a date within the next 14 days';
        },
      },
    });
  };
}

export class CreateDemoRequestDto {
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MinLength(2)
  @MaxLength(80)
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      let clean = value.trim().replace(/[\s\-]/g, '');
      if (clean.startsWith('+91')) {
        clean = clean.substring(3);
      } else if (clean.startsWith('91') && clean.length === 12) {
        clean = clean.substring(2);
      } else if (clean.startsWith('0') && clean.length === 11) {
        clean = clean.substring(1);
      }
      return clean;
    }
    return value;
  })
  @Matches(/^[6-9]\d{9}$/, { message: 'Phone must be a valid 10-digit Indian mobile number' })
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  pgName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  companyName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  city?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5000)
  approxBeds?: number;

  @IsOptional()
  @IsEnum(PreferredTime)
  preferredTime?: PreferredTime;

  @IsString()
  @IsNotEmpty()
  @IsValidPreferredDate({ message: 'Please choose a date within the next 14 days' })
  preferredDate: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  message?: string;

  @IsOptional()
  @IsString()
  website?: string;
}
