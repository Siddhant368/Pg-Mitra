import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddressDto {
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  pincode?: string;
}

export class EmergencyContactDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  relation?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}

export class AcademicInfoDto {
  @IsString()
  @IsOptional()
  college?: string;

  @IsString()
  @IsOptional()
  course?: string;

  @IsString()
  @IsOptional()
  branch?: string;

  @IsString()
  @IsOptional()
  year?: string;

  @IsString()
  @IsOptional()
  rollNumber?: string;
}

export class GuardianInfoDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  relation?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  occupation?: string;

  @IsString()
  @IsOptional()
  address?: string;
}

export class AccommodationDto {
  @IsString()
  @IsOptional()
  pgId?: string;

  @IsString()
  @IsOptional()
  pgName?: string;

  @IsString()
  @IsOptional()
  building?: string;

  @IsString()
  @IsOptional()
  floor?: string;

  @IsString()
  @IsOptional()
  roomNumber?: string;

  @IsString()
  @IsOptional()
  roomId?: string;

  @IsString()
  @IsOptional()
  bedNumber?: string;

  @IsString()
  @IsOptional()
  bedId?: string;

  @IsString()
  @IsOptional()
  sharingType?: string;

  @IsString()
  @IsOptional()
  joiningDate?: string;

  @IsString()
  @IsOptional()
  expectedLeavingDate?: string;

  @IsNumber()
  @IsOptional()
  monthlyRent?: number;

  @IsNumber()
  @IsOptional()
  securityDeposit?: number;

  @IsString()
  @IsOptional()
  depositStatus?: string;

  @IsNumber()
  @IsOptional()
  noticePeriodDays?: number;
}

export class StudentDocumentDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  fileName?: string;

  @IsString()
  @IsOptional()
  fileSize?: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsString()
  @IsOptional()
  uploadedAt?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}

export class RentRecordDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  month?: string;

  @IsNumber()
  @IsOptional()
  year?: number;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  paidDate?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  receiptNumber?: string;

  @IsString()
  @IsOptional()
  collectedBy?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class AttendanceRecordDto {
  @IsString()
  @IsOptional()
  date?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  inTime?: string;

  @IsString()
  @IsOptional()
  outTime?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class AttendanceDto {
  @IsNumber()
  @IsOptional()
  monthlyPercentage?: number;

  @IsNumber()
  @IsOptional()
  presentDays?: number;

  @IsNumber()
  @IsOptional()
  totalDays?: number;

  @IsString()
  @IsOptional()
  lastPunchIn?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttendanceRecordDto)
  records?: AttendanceRecordDto[];
}

export class StudentComplaintDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  ticketId?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  createdAt?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  resolvedAt?: string;
}

export class ActivityTimelineItemDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  timestamp?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  actor?: string;
}

export class AdminNoteDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  createdAt?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  priority?: string;
}

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  studentId?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  alternatePhone?: string;

  @IsString()
  @IsOptional()
  dob?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  bloodGroup?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  emergencyContact?: EmergencyContactDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AcademicInfoDto)
  academic?: AcademicInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => GuardianInfoDto)
  guardian?: GuardianInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => AccommodationDto)
  accommodation?: AccommodationDto;

  @IsString()
  @IsOptional()
  rentStatus?: string;

  @IsNumber()
  @IsOptional()
  rentDueAmount?: number;

  @IsString()
  @IsOptional()
  nextRentDueDate?: string;

  @IsString()
  @IsOptional()
  verificationStatus?: string;

  @IsString()
  @IsOptional()
  accountStatus?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => StudentDocumentDto)
  documents?: StudentDocumentDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RentRecordDto)
  rentHistory?: RentRecordDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => AttendanceDto)
  attendance?: AttendanceDto;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => StudentComplaintDto)
  complaints?: StudentComplaintDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ActivityTimelineItemDto)
  timeline?: ActivityTimelineItemDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminNoteDto)
  adminNotes?: AdminNoteDto[];
}
