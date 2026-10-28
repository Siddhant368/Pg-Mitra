import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bed, BedDocument, BedStatus } from './schemas/bed.schema.js';
import { Room, RoomDocument } from './schemas/room.schema.js';
import { Pg, PgDocument } from '../pgs/schemas/pg.schema.js';
import { CreateBedDto } from './dto/create-bed.dto.js';
import { UpdateBedDto } from './dto/update-bed.dto.js';
import { getBedLabel } from './rooms.service.js';

@Injectable()
export class BedsService {
  constructor(
    @InjectModel(Bed.name) private readonly bedModel: Model<BedDocument>,
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    @InjectModel(Pg.name) private readonly pgModel: Model<PgDocument>,
  ) {}

  /**
   * Helper: Ensure room exists, belongs to owner, and belongs to pgId (if provided)
   */
  async verifyRoomAccess(
    roomId: string,
    ownerId: string,
    pgId?: string,
  ): Promise<RoomDocument> {
    const room = await this.roomModel
      .findOne({
        _id: new Types.ObjectId(roomId),
        ownerId: new Types.ObjectId(ownerId),
      })
      .exec();

    if (!room) {
      throw new NotFoundException('Room not found or access denied');
    }

    if (pgId && room.pgId.toString() !== pgId) {
      throw new NotFoundException('Room does not belong to specified PG');
    }

    return room;
  }

  /**
   * Helper: Format single bed response
   */
  private formatBed(bed: any, roomNumber?: string) {
    const obj = bed.toJSON ? bed.toJSON() : { ...bed };
    const label =
      obj.label || (roomNumber ? getBedLabel(roomNumber, obj.bedNumber) : `Bed ${obj.bedNumber}`);

    return {
      ...obj,
      id: obj._id ? obj._id.toString() : obj.id,
      _id: obj._id ? obj._id.toString() : obj.id,
      roomId: obj.roomId ? obj.roomId.toString() : obj.roomId,
      pgId: obj.pgId ? obj.pgId.toString() : obj.pgId,
      ownerId: obj.ownerId ? obj.ownerId.toString() : obj.ownerId,
      label,
      isOccupied: obj.status === BedStatus.OCCUPIED,
    };
  }

  /**
   * List beds for a room
   */
  async findAll(
    roomId: string,
    ownerId: string,
    pgId?: string,
  ): Promise<any[]> {
    const room = await this.verifyRoomAccess(roomId, ownerId, pgId);

    const beds = await this.bedModel
      .find({ roomId: room._id })
      .sort({ bedNumber: 1 })
      .exec();

    return beds.map((b) => this.formatBed(b, room.roomNumber));
  }

  /**
   * Create a single bed in a room up to configured bedCapacity
   */
  async create(
    roomId: string,
    ownerId: string,
    createBedDto: CreateBedDto,
    pgId?: string,
  ): Promise<any> {
    const room = await this.verifyRoomAccess(roomId, ownerId, pgId);

    const currentBeds = await this.bedModel
      .find({ roomId: room._id })
      .sort({ bedNumber: 1 })
      .exec();

    if (currentBeds.length >= room.bedCapacity) {
      throw new BadRequestException(
        `Room bed capacity reached (capacity: ${room.bedCapacity}). Increase room capacity to add more beds.`,
      );
    }

    // Determine bedNumber
    let bedNumber = createBedDto.bedNumber;
    if (bedNumber !== undefined) {
      const exists = currentBeds.some((b) => b.bedNumber === bedNumber);
      if (exists) {
        throw new ConflictException(
          `Bed number ${bedNumber} already exists in this room`,
        );
      }
    } else {
      // Find lowest available positive integer
      const usedNumbers = new Set(currentBeds.map((b) => b.bedNumber));
      let candidate = 1;
      while (usedNumbers.has(candidate)) {
        candidate++;
      }
      bedNumber = candidate;
    }

    const status = createBedDto.status || BedStatus.AVAILABLE;
    const label =
      createBedDto.label?.trim() || getBedLabel(room.roomNumber, bedNumber);

    const bed = new this.bedModel({
      roomId: room._id,
      pgId: room.pgId,
      ownerId: room.ownerId,
      bedNumber,
      label,
      status,
      isOccupied: status === BedStatus.OCCUPIED,
      monthlyRent: createBedDto.monthlyRent ?? room.monthlyRent,
      tenantName: createBedDto.tenantName?.trim(),
      tenantPhone: createBedDto.tenantPhone?.trim(),
    });

    const saved = await bed.save();
    return this.formatBed(saved, room.roomNumber);
  }

  /**
   * View bed details
   */
  async findOne(
    bedId: string,
    ownerId: string,
    roomId?: string,
    pgId?: string,
  ): Promise<any> {
    const bed = await this.bedModel
      .findOne({
        _id: new Types.ObjectId(bedId),
        ownerId: new Types.ObjectId(ownerId),
      })
      .exec();

    if (!bed) {
      throw new NotFoundException('Bed not found or access denied');
    }

    if (roomId && bed.roomId.toString() !== roomId) {
      throw new NotFoundException('Bed does not belong to specified room');
    }

    if (pgId && bed.pgId.toString() !== pgId) {
      throw new NotFoundException('Bed does not belong to specified PG');
    }

    const room = await this.roomModel.findById(bed.roomId).exec();
    return this.formatBed(bed, room?.roomNumber);
  }

  /**
   * Update permitted bed fields with transition validation
   */
  async update(
    bedId: string,
    ownerId: string,
    updateBedDto: UpdateBedDto,
    roomId?: string,
    pgId?: string,
  ): Promise<any> {
    const bed = await this.bedModel
      .findOne({
        _id: new Types.ObjectId(bedId),
        ownerId: new Types.ObjectId(ownerId),
      })
      .exec();

    if (!bed) {
      throw new NotFoundException('Bed not found or access denied');
    }

    if (roomId && bed.roomId.toString() !== roomId) {
      throw new NotFoundException('Bed does not belong to specified room');
    }

    if (pgId && bed.pgId.toString() !== pgId) {
      throw new NotFoundException('Bed does not belong to specified PG');
    }

    // Check duplicate bedNumber in room if changed
    if (
      updateBedDto.bedNumber !== undefined &&
      updateBedDto.bedNumber !== bed.bedNumber
    ) {
      const conflict = await this.bedModel
        .findOne({
          roomId: bed.roomId,
          bedNumber: updateBedDto.bedNumber,
          _id: { $ne: bed._id },
        })
        .exec();

      if (conflict) {
        throw new ConflictException(
          `Bed number ${updateBedDto.bedNumber} already exists in this room`,
        );
      }
      bed.bedNumber = updateBedDto.bedNumber;
    }

    // Status transition validation
    if (updateBedDto.status && updateBedDto.status !== bed.status) {
      const isBecomingAvailable =
        updateBedDto.status === BedStatus.AVAILABLE ||
        updateBedDto.status === BedStatus.VACANT;

      if (isBecomingAvailable && bed.tenantId) {
        throw new BadRequestException(
          'Cannot mark bed available while an active tenant assignment exists',
        );
      }

      bed.status = updateBedDto.status;
      bed.isOccupied = updateBedDto.status === BedStatus.OCCUPIED;
    }

    if (updateBedDto.label !== undefined) {
      bed.label = updateBedDto.label.trim();
    }
    if (updateBedDto.monthlyRent !== undefined) {
      bed.monthlyRent = updateBedDto.monthlyRent;
    }
    if (updateBedDto.tenantName !== undefined) {
      bed.tenantName = updateBedDto.tenantName?.trim();
    }
    if (updateBedDto.tenantPhone !== undefined) {
      bed.tenantPhone = updateBedDto.tenantPhone?.trim();
    }

    const saved = await bed.save();
    const room = await this.roomModel.findById(bed.roomId).exec();
    return this.formatBed(saved, room?.roomNumber);
  }

  /**
   * Delete a bed safely
   */
  async remove(
    bedId: string,
    ownerId: string,
    roomId?: string,
    pgId?: string,
  ): Promise<{ message: string; id: string }> {
    const bed = await this.bedModel
      .findOne({
        _id: new Types.ObjectId(bedId),
        ownerId: new Types.ObjectId(ownerId),
      })
      .exec();

    if (!bed) {
      throw new NotFoundException('Bed not found or access denied');
    }

    if (roomId && bed.roomId.toString() !== roomId) {
      throw new NotFoundException('Bed does not belong to specified room');
    }

    if (pgId && bed.pgId.toString() !== pgId) {
      throw new NotFoundException('Bed does not belong to specified PG');
    }

    if (bed.status === BedStatus.OCCUPIED) {
      throw new BadRequestException('Cannot delete an occupied bed');
    }

    if (bed.tenantId) {
      throw new BadRequestException(
        'Cannot delete a bed linked to an active tenant',
      );
    }

    await this.bedModel.deleteOne({ _id: bed._id }).exec();
    return { message: 'Bed deleted successfully', id: bedId };
  }

  /**
   * Mark bed occupied (convenience helper)
   */
  async markOccupied(bedId: string, ownerId: string): Promise<any> {
    const bed = await this.bedModel
      .findOne({
        _id: new Types.ObjectId(bedId),
        ownerId: new Types.ObjectId(ownerId),
      })
      .exec();

    if (!bed) {
      throw new NotFoundException('Bed not found');
    }

    if (bed.status === BedStatus.OCCUPIED) {
      throw new ConflictException('Bed is already occupied');
    }

    bed.status = BedStatus.OCCUPIED;
    bed.isOccupied = true;
    const saved = await bed.save();
    return this.formatBed(saved);
  }

  /**
   * Mark bed vacant (convenience helper)
   */
  async markVacant(bedId: string, ownerId: string): Promise<any> {
    const bed = await this.bedModel
      .findOne({
        _id: new Types.ObjectId(bedId),
        ownerId: new Types.ObjectId(ownerId),
      })
      .exec();

    if (!bed) {
      throw new NotFoundException('Bed not found');
    }

    if (bed.tenantId) {
      throw new BadRequestException(
        'Cannot mark bed vacant while an active tenant assignment exists',
      );
    }

    bed.status = BedStatus.AVAILABLE;
    bed.isOccupied = false;
    const saved = await bed.save();
    return this.formatBed(saved);
  }

  /**
   * Find vacant beds across a PG
   */
  async findVacantBeds(pgId: string, ownerId: string): Promise<any[]> {
    return this.bedModel.aggregate([
      {
        $match: {
          pgId: new Types.ObjectId(pgId),
          ownerId: new Types.ObjectId(ownerId),
          status: { $in: [BedStatus.AVAILABLE, BedStatus.VACANT] },
        },
      },
      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: '_id',
          as: 'room',
        },
      },
      { $unwind: '$room' },
      {
        $project: {
          id: { $toString: '$_id' },
          bedNumber: 1,
          label: 1,
          status: 1,
          roomId: { $toString: '$roomId' },
          roomNumber: '$room.roomNumber',
          floor: '$room.floor',
          monthlyRent: { $ifNull: ['$monthlyRent', '$room.monthlyRent'] },
        },
      },
    ]);
  }
}
