import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DemoRequestDocument = HydratedDocument<DemoRequest>;

export enum PreferredTime {
  MORNING = 'MORNING',
  AFTERNOON = 'AFTERNOON',
  EVENING = 'EVENING',
}

export enum DemoRequestStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  CLOSED = 'CLOSED',
}

export enum NotifyStatus {
  SENT = 'SENT',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

export enum EmailStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED',
}

@Schema({ timestamps: true })
export class DemoRequest {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: false })
  pgName?: string;

  @Prop({ required: false })
  city?: string;

  @Prop({ required: false })
  approxBeds?: number;

  @Prop({ required: true, type: String, enum: PreferredTime })
  preferredTime: PreferredTime;

  @Prop({ required: true })
  preferredDate: string;

  @Prop({ required: false, maxlength: 1000 })
  message?: string;

  @Prop({ required: true, type: String, enum: DemoRequestStatus, default: DemoRequestStatus.NEW })
  status: DemoRequestStatus;

  @Prop({ default: 'landing' })
  source: string;

  @Prop({ required: true, type: String, enum: EmailStatus, default: EmailStatus.PENDING })
  emailStatus: EmailStatus;

  @Prop({ required: false })
  emailSentAt?: Date;

  @Prop({ required: false, maxlength: 500 })
  emailError?: string;

  @Prop({ required: false })
  emailMessageId?: string;

  @Prop({ required: false, type: String, enum: NotifyStatus })
  notifyStatus?: NotifyStatus;

  @Prop({ required: false })
  notifiedAt?: Date;

  @Prop({ required: false, maxlength: 200 })
  notifyError?: string;

  // Timestamps managed by Mongoose timestamps: true
  createdAt?: Date;
  updatedAt?: Date;
}

export const DemoRequestSchema = SchemaFactory.createForClass(DemoRequest);
