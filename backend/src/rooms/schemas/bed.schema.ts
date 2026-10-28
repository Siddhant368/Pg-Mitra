import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BedDocument = Bed & Document;

export enum BedStatus {
  AVAILABLE = 'AVAILABLE',
  VACANT = 'VACANT',
  RESERVED = 'RESERVED',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_doc, ret: any) => {
      ret.id = ret._id.toString();
      ret.roomId = ret.roomId?.toString();
      ret.pgId = ret.pgId?.toString();
      ret.ownerId = ret.ownerId?.toString();
      if (ret.tenantId) {
        ret.tenantId = ret.tenantId.toString();
      }
      ret.isOccupied = ret.status === BedStatus.OCCUPIED;
      delete ret.__v;
      return ret;
    },
  },
})
export class Bed {
  @Prop({ type: Types.ObjectId, ref: 'Room', required: true, index: true })
  roomId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Pg', required: true, index: true })
  pgId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  bedNumber: number;

  @Prop({ trim: true })
  label: string;

  @Prop({
    type: String,
    enum: Object.values(BedStatus),
    default: BedStatus.AVAILABLE,
  })
  status: BedStatus;

  @Prop({ default: false })
  isOccupied: boolean;

  @Prop({ min: 0 })
  monthlyRent?: number;

  @Prop({ type: Types.ObjectId, ref: 'Tenant' })
  tenantId?: Types.ObjectId;

  @Prop({ trim: true })
  tenantName?: string;

  @Prop({ trim: true })
  tenantPhone?: string;
}

export const BedSchema = SchemaFactory.createForClass(Bed);

BedSchema.index({ roomId: 1, bedNumber: 1 }, { unique: true });
BedSchema.index({ pgId: 1, status: 1 });
BedSchema.index({ ownerId: 1, pgId: 1 });
BedSchema.index({ roomId: 1, status: 1 });
