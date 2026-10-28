import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Pg, PgDocument } from './schemas/pg.schema.js';
import { Room, RoomDocument } from '../rooms/schemas/room.schema.js';
import { CreatePgDto } from './dto/create-pg.dto.js';
import { UpdatePgDto } from './dto/update-pg.dto.js';

@Injectable()
export class PgsService {
  constructor(
    @InjectModel(Pg.name) private readonly pgModel: Model<PgDocument>,
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
  ) {}

  async create(ownerId: string, createPgDto: CreatePgDto): Promise<PgDocument> {
    try {
      const createdPg = new this.pgModel({
        ...createPgDto,
        ownerId: new Types.ObjectId(ownerId),
      });
      return await createdPg.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('A property with this name already exists for your account.');
      }
      throw error;
    }
  }

  async findAllByOwner(ownerId: string): Promise<PgDocument[]> {
    return this.pgModel.find({ ownerId: new Types.ObjectId(ownerId) }).sort({ createdAt: -1 }).exec();
  }

  async findOneByOwner(id: string, ownerId: string): Promise<PgDocument> {
    const pg = await this.pgModel.findOne({
      _id: new Types.ObjectId(id),
      ownerId: new Types.ObjectId(ownerId),
    }).exec();
    
    if (!pg) {
      throw new NotFoundException('PG not found or access denied');
    }
    return pg;
  }

  async updateByOwner(id: string, ownerId: string, updatePgDto: UpdatePgDto): Promise<PgDocument> {
    // Check existence and ownership first
    await this.findOneByOwner(id, ownerId);
    
    try {
      const updatedPg = await this.pgModel.findOneAndUpdate(
        { _id: new Types.ObjectId(id), ownerId: new Types.ObjectId(ownerId) },
        updatePgDto,
        { new: true, runValidators: true }
      ).exec();

      if (!updatedPg) {
        throw new NotFoundException('PG not found or access denied');
      }
      return updatedPg;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('A property with this name already exists for your account.');
      }
      throw error;
    }
  }

  async deleteByOwner(id: string, ownerId: string): Promise<{ deleted: boolean }> {
    // Check existence and ownership first
    await this.findOneByOwner(id, ownerId);

    const roomsCount = await this.roomModel.countDocuments({
      pgId: new Types.ObjectId(id),
    }).exec();
    if (roomsCount > 0) {
      throw new BadRequestException('Cannot delete PG with existing rooms');
    }

    const result = await this.pgModel.deleteOne({
      _id: new Types.ObjectId(id),
      ownerId: new Types.ObjectId(ownerId),
    }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('PG not found or access denied');
    }
    return { deleted: true };
  }
}
