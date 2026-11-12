import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StudentDocumentType = Student & Document;

export enum RentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE',
  PARTIAL = 'PARTIAL',
}

export enum VerificationStatus {
  VERIFIED = 'VERIFIED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  NOTICE = 'NOTICE',
  CHECKED_OUT = 'CHECKED_OUT',
  BLACKLISTED = 'BLACKLISTED',
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: any) => {
      ret.id = ret._id ? ret._id.toString() : ret.id;
      ret.ownerId = ret.ownerId ? ret.ownerId.toString() : ret.ownerId;
      delete ret.__v;
      return ret;
    },
  },
})
export class Student {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true, trim: true, index: true })
  studentId: string; // e.g., "PGM-2026-0101"

  @Prop({ required: true, trim: true, index: true })
  name: string;

  @Prop({ trim: true })
  avatarUrl?: string;

  @Prop({ required: true, trim: true, lowercase: true, index: true })
  email: string;

  @Prop({ required: true, trim: true, index: true })
  phone: string;

  @Prop({ trim: true })
  alternatePhone?: string;

  @Prop({ trim: true })
  dob?: string;

  @Prop({ trim: true, default: 'Male' })
  gender: string;

  @Prop({ trim: true })
  bloodGroup?: string;

  @Prop({ type: Object, default: {} })
  address: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };

  @Prop({ type: Object, default: {} })
  emergencyContact: {
    name?: string;
    relation?: string;
    phone?: string;
  };

  @Prop({ type: Object, default: {} })
  academic: {
    college?: string;
    course?: string;
    branch?: string;
    year?: string;
    rollNumber?: string;
  };

  @Prop({ type: Object, default: {} })
  guardian: {
    name?: string;
    relation?: string;
    phone?: string;
    occupation?: string;
    address?: string;
  };

  @Prop({ type: Object, default: {} })
  accommodation: {
    pgId?: string;
    pgName?: string;
    building?: string;
    floor?: string;
    roomNumber?: string;
    roomId?: string;
    bedNumber?: string;
    bedId?: string;
    sharingType?: string;
    joiningDate?: string;
    expectedLeavingDate?: string;
    monthlyRent?: number;
    securityDeposit?: number;
    depositStatus?: string;
    noticePeriodDays?: number;
  };

  @Prop({
    type: String,
    enum: Object.values(RentStatus),
    default: RentStatus.PENDING,
    index: true,
  })
  rentStatus: RentStatus;

  @Prop({ type: Number, default: 0 })
  rentDueAmount: number;

  @Prop({ trim: true })
  nextRentDueDate?: string;

  @Prop({
    type: String,
    enum: Object.values(VerificationStatus),
    default: VerificationStatus.PENDING,
    index: true,
  })
  verificationStatus: VerificationStatus;

  @Prop({
    type: String,
    enum: Object.values(AccountStatus),
    default: AccountStatus.ACTIVE,
    index: true,
  })
  accountStatus: AccountStatus;

  @Prop({ type: [Object], default: [] })
  documents: Array<{
    id: string;
    type: string;
    title: string;
    fileName: string;
    fileSize: string;
    fileUrl?: string;
    uploadedAt: string;
    status: string;
    rejectionReason?: string;
  }>;

  @Prop({ type: [Object], default: [] })
  rentHistory: Array<{
    id: string;
    month: string;
    year: number;
    amount: number;
    dueDate: string;
    paidDate?: string;
    paymentMethod?: string;
    transactionId?: string;
    status: string;
    receiptNumber?: string;
    collectedBy?: string;
    notes?: string;
  }>;

  @Prop({
    type: Object,
    default: {
      monthlyPercentage: 100,
      presentDays: 30,
      totalDays: 30,
      records: [],
    },
  })
  attendance: {
    monthlyPercentage: number;
    presentDays: number;
    totalDays: number;
    lastPunchIn?: string;
    records: Array<{
      date: string;
      status: string;
      inTime?: string;
      outTime?: string;
      notes?: string;
    }>;
  };

  @Prop({ type: [Object], default: [] })
  complaints: Array<{
    id: string;
    ticketId: string;
    category: string;
    title: string;
    description: string;
    createdAt: string;
    status: string;
    priority: string;
    resolvedAt?: string;
  }>;

  @Prop({ type: [Object], default: [] })
  timeline: Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: string;
    actor: string;
  }>;

  @Prop({ type: [Object], default: [] })
  adminNotes: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: string;
    priority: string;
  }>;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.index({ ownerId: 1, studentId: 1 });
StudentSchema.index({ ownerId: 1, 'accommodation.pgId': 1 });
StudentSchema.index({ ownerId: 1, accountStatus: 1 });
StudentSchema.index({ ownerId: 1, rentStatus: 1 });
StudentSchema.index({ ownerId: 1, verificationStatus: 1 });
