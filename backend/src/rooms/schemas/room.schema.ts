import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RoomDocument = Room & Document;

export enum RoomType {
  SINGLE = 'SINGLE',
  DOUBLE = 'DOUBLE',
  TRIPLE = 'TRIPLE',
  FOUR_SHARING = 'FOUR_SHARING',
  CUSTOM = 'CUSTOM',
}

export enum BathroomType {
  ATTACHED = 'ATTACHED',
  SHARED = 'SHARED',
  COMMON = 'COMMON',
}

export enum FurnishingType {
  FURNISHED = 'FURNISHED',
  SEMI_FURNISHED = 'SEMI_FURNISHED',
  UNFURNISHED = 'UNFURNISHED',
}

export enum RoomOccupancyStatus {
  VACANT = 'VACANT',
  OCCUPIED = 'OCCUPIED',
  PARTIALLY_OCCUPIED = 'PARTIALLY_OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
}

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_doc, ret: any) => {
      ret.id = ret._id.toString();
      ret.pgId = ret.pgId?.toString();
      ret.ownerId = ret.ownerId?.toString();
      delete ret.__v;
      return ret;
    },
  },
})
export class Room {
  @Prop({ type: Types.ObjectId, ref: 'Pg', required: true, index: true })
  pgId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true, trim: true, maxlength: 50 })
  roomNumber: string;

  @Prop({ required: true, default: 1 })
  floor: number;

  @Prop({
    type: String,
    enum: Object.values(RoomType),
    default: RoomType.DOUBLE,
  })
  roomType: string;

  @Prop({ required: true, min: 1, default: 1 })
  bedCapacity: number;

  @Prop({ required: true, min: 1, default: 1 })
  sharing: number;

  @Prop({ required: true, min: 0, default: 0 })
  monthlyRent: number;

  @Prop({ required: true, min: 0, default: 0 })
  rentPerBed: number;

  @Prop({ min: 0 })
  securityDeposit?: number;

  @Prop({
    type: String,
    enum: Object.values(BathroomType),
    default: BathroomType.ATTACHED,
  })
  bathroomType?: string;

  @Prop({
    type: String,
    enum: Object.values(FurnishingType),
    default: FurnishingType.FURNISHED,
  })
  furnishing?: string;

  @Prop({ type: [String], default: [] })
  amenities: string[];

  @Prop({
    type: String,
    enum: Object.values(RoomOccupancyStatus),
    default: RoomOccupancyStatus.VACANT,
  })
  status: string;

  @Prop({ trim: true })
  description?: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);

RoomSchema.index(
  { pgId: 1, roomNumber: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } },
);
RoomSchema.index({ ownerId: 1, pgId: 1 });
RoomSchema.index({ pgId: 1, floor: 1 });
