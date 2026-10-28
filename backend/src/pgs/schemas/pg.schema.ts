import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PgDocument = Pg & Document;

export enum PgType {
  BOYS = 'BOYS',
  GIRLS = 'GIRLS',
  COLIVING = 'COLIVING',
}

@Schema({ timestamps: true })
export class Pg {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  ownerId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ required: true, trim: true })
  state: string;

  @Prop({ required: true, trim: true })
  pincode: string;

  @Prop({ required: true, trim: true })
  contactPhone: string;

  @Prop({ required: true, enum: PgType })
  type: PgType;

  @Prop({ required: true, min: 0 })
  totalRooms: number;

  @Prop({ required: true, min: 0 })
  totalBeds: number;

  @Prop({ trim: true })
  rentRange: string;

  @Prop({ type: [String], default: [] })
  amenities: string[];
}

export const PgSchema = SchemaFactory.createForClass(Pg);
