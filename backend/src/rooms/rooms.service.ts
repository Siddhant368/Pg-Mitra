import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { Connection } from 'mongoose';
import { Room, RoomDocument, RoomOccupancyStatus } from './schemas/room.schema.js';
import { Bed, BedDocument, BedStatus } from './schemas/bed.schema.js';
import { Pg, PgDocument } from '../pgs/schemas/pg.schema.js';
import { CreateRoomDto } from './dto/create-room.dto.js';
import { UpdateRoomDto } from './dto/update-room.dto.js';
import { RoomQueryDto } from './dto/room-query.dto.js';

export function getBedLabel(roomNumber: string, bedNumber: number): string {
  const letter = String.fromCharCode(64 + bedNumber);
  return `${roomNumber}-${letter}`;
}

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    @InjectModel(Bed.name) private readonly bedModel: Model<BedDocument>,
    @InjectModel(Pg.name) private readonly pgModel: Model<PgDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  /**
   * Helper: Ensure PG exists and belongs to the owner
   */
  async verifyPgOwnership(pgId: string, ownerId: string): Promise<PgDocument> {
    const pg = await this.pgModel.findOne({
      _id: new Types.ObjectId(pgId),
      ownerId: new Types.ObjectId(ownerId),
    }).exec();

    if (!pg) {
      throw new NotFoundException('PG not found or access denied');
    }
    return pg;
  }

  /**
   * Helper: Format room with beds and calculate accurate occupancy metrics
   */
  private formatRoom(room: any, beds: any[] = []) {
    const roomBeds = (beds || [])
      .filter((b) => !b.roomId || b.roomId.toString() === room._id.toString())
      .map((b) => {
        const bedObj = b.toJSON ? b.toJSON() : { ...b };
        return {
          ...bedObj,
          id: bedObj._id ? bedObj._id.toString() : bedObj.id,
          label: bedObj.label || getBedLabel(room.roomNumber, bedObj.bedNumber),
          isOccupied: bedObj.status === BedStatus.OCCUPIED,
        };
      })
      .sort((a, b) => a.bedNumber - b.bedNumber);

    const totalBeds = roomBeds.length;
    const occupiedBeds = roomBeds.filter(
      (b) => b.status === BedStatus.OCCUPIED,
    ).length;
    const reservedBeds = roomBeds.filter(
      (b) => b.status === BedStatus.RESERVED,
    ).length;
    const maintenanceBeds = roomBeds.filter(
      (b) => b.status === BedStatus.MAINTENANCE,
    ).length;
    const availableBeds = roomBeds.filter(
      (b) => b.status === BedStatus.AVAILABLE || b.status === BedStatus.VACANT,
    ).length;

    let computedStatus = RoomOccupancyStatus.VACANT;
    if (maintenanceBeds === totalBeds && totalBeds > 0) {
      computedStatus = RoomOccupancyStatus.MAINTENANCE;
    } else if (occupiedBeds >= totalBeds && totalBeds > 0) {
      computedStatus = RoomOccupancyStatus.OCCUPIED;
    } else if (occupiedBeds > 0) {
      computedStatus = RoomOccupancyStatus.PARTIALLY_OCCUPIED;
    }

    const roomObj = room.toJSON ? room.toJSON() : { ...room };

    return {
      ...roomObj,
      id: roomObj._id ? roomObj._id.toString() : roomObj.id,
      _id: roomObj._id ? roomObj._id.toString() : roomObj.id,
      pgId: roomObj.pgId ? roomObj.pgId.toString() : roomObj.pgId,
      ownerId: roomObj.ownerId ? roomObj.ownerId.toString() : roomObj.ownerId,
      status: computedStatus,
      totalBeds,
      occupiedBeds,
      availableBeds,
      vacantBeds: availableBeds,
      reservedBeds,
      maintenanceBeds,
      beds: roomBeds,
    };
  }

  /**
   * Create a new room with automatic bed provisioning
   */
  async create(
    pgId: string,
    ownerId: string,
    createRoomDto: CreateRoomDto,
  ): Promise<any> {
    await this.verifyPgOwnership(pgId, ownerId);

    const roomNumber = createRoomDto.roomNumber.trim();
    const floor = createRoomDto.floor !== undefined ? createRoomDto.floor : 1;
    const capacity =
      createRoomDto.bedCapacity ?? createRoomDto.sharing ?? 2;
    const rent =
      createRoomDto.monthlyRent ?? createRoomDto.rentPerBed ?? 0;

    // Check duplicate room number in this PG
    const existing = await this.roomModel
      .findOne({
        pgId: new Types.ObjectId(pgId),
        roomNumber,
      })
      .collation({ locale: 'en', strength: 2 })
      .exec();

    if (existing) {
      throw new ConflictException('Room number already exists in this PG');
    }

    const roomData = {
      pgId: new Types.ObjectId(pgId),
      ownerId: new Types.ObjectId(ownerId),
      roomNumber,
      floor,
      roomType: createRoomDto.roomType || 'DOUBLE',
      bedCapacity: capacity,
      sharing: capacity,
      monthlyRent: rent,
      rentPerBed: rent,
      securityDeposit: createRoomDto.securityDeposit,
      bathroomType: createRoomDto.bathroomType || 'ATTACHED',
      furnishing: createRoomDto.furnishing || 'FURNISHED',
      amenities: createRoomDto.amenities || [],
      description: createRoomDto.description?.trim(),
      status: RoomOccupancyStatus.VACANT,
    };

    // Attempt transactional creation with fallback for standalone MongoDB instances
    try {
      const session = await this.connection.startSession();
      try {
        let createdRoom: RoomDocument;
        let createdBeds: BedDocument[] = [];

        await session.withTransaction(async () => {
          const roomDoc = new this.roomModel(roomData);
          createdRoom = await roomDoc.save({ session });

          const bedsToCreate = Array.from({ length: capacity }, (_, i) => ({
            roomId: createdRoom._id,
            pgId: new Types.ObjectId(pgId),
            ownerId: new Types.ObjectId(ownerId),
            bedNumber: i + 1,
            label: getBedLabel(roomNumber, i + 1),
            status: BedStatus.AVAILABLE,
            isOccupied: false,
            monthlyRent: rent,
          }));

          createdBeds = (await this.bedModel.insertMany(bedsToCreate, {
            session,
          })) as unknown as BedDocument[];
        });

        session.endSession();
        return this.formatRoom(createdRoom!, createdBeds);
      } catch (err: any) {
        session.endSession();
        if (err.code === 11000) {
          throw new ConflictException('Room number already exists in this PG');
        }
        if (
          err.message &&
          (err.message.includes('Transaction') ||
            err.message.includes('replica set'))
        ) {
          return this.createWithoutTransaction(pgId, ownerId, roomData, capacity);
        }
        throw err;
      }
    } catch (sessionErr: any) {
      if (sessionErr instanceof ConflictException) {
        throw sessionErr;
      }
      return this.createWithoutTransaction(pgId, ownerId, roomData, capacity);
    }
  }

  /**
   * Fallback room & bed creation with safe compensation
   */
  private async createWithoutTransaction(
    pgId: string,
    ownerId: string,
    roomData: any,
    capacity: number,
  ) {
    let createdRoom: RoomDocument | null = null;
    try {
      createdRoom = await this.roomModel.create(roomData);
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ConflictException('Room number already exists in this PG');
      }
      throw err;
    }

    try {
      const bedsToCreate = Array.from({ length: capacity }, (_, i) => ({
        roomId: createdRoom!._id,
        pgId: new Types.ObjectId(pgId),
        ownerId: new Types.ObjectId(ownerId),
        bedNumber: i + 1,
        label: getBedLabel(createdRoom!.roomNumber, i + 1),
        status: BedStatus.AVAILABLE,
        isOccupied: false,
        monthlyRent: createdRoom!.monthlyRent,
      }));

      const createdBeds = await this.bedModel.insertMany(bedsToCreate);
      return this.formatRoom(createdRoom, createdBeds);
    } catch (bedErr) {
      // Compensate: remove created room
      if (createdRoom?._id) {
        await this.roomModel.deleteOne({ _id: createdRoom._id }).exec();
      }
      throw bedErr;
    }
  }

  /**
   * List rooms for a PG with full search, filter, sort, and pagination support
   */
  async findAll(
    pgId: string,
    ownerId: string,
    query?: RoomQueryDto,
  ): Promise<any> {
    await this.verifyPgOwnership(pgId, ownerId);

    const filter: any = {
      pgId: new Types.ObjectId(pgId),
      ownerId: new Types.ObjectId(ownerId),
    };

    if (query?.floor !== undefined) {
      filter.floor = query.floor;
    }

    const rooms = await this.roomModel.find(filter).exec();
    const roomIds = rooms.map((r) => r._id);

    const beds = await this.bedModel
      .find({ roomId: { $in: roomIds } })
      .exec();

    let formattedRooms = rooms.map((r) => this.formatRoom(r, beds));

    // Client-level search
    const searchQuery = (query?.search || query?.q || '').trim().toLowerCase();
    if (searchQuery) {
      formattedRooms = formattedRooms.filter((r) =>
        r.roomNumber.toLowerCase().includes(searchQuery),
      );
    }

    // Filter by sharing
    if (query?.sharing !== undefined) {
      formattedRooms = formattedRooms.filter(
        (r) => r.bedCapacity === query.sharing || r.sharing === query.sharing,
      );
    }

    // Filter by occupancy status
    if (query?.status && query.status !== 'ALL') {
      const st = query.status.toUpperCase();
      formattedRooms = formattedRooms.filter((r) => {
        if (st === 'VACANT') return r.occupiedBeds === 0;
        if (st === 'OCCUPIED')
          return r.occupiedBeds >= r.totalBeds && r.totalBeds > 0;
        if (st === 'PARTIAL' || st === 'PARTIALLY_OCCUPIED')
          return r.occupiedBeds > 0 && r.occupiedBeds < r.totalBeds;
        if (st === 'MAINTENANCE') return r.status === 'MAINTENANCE';
        return true;
      });
    }

    // Sorting
    const sortBy = query?.sortBy || 'floor';
    const sortOrder = query?.sortOrder === 'desc' ? -1 : 1;

    formattedRooms.sort((a, b) => {
      if (sortBy === 'roomNumber') {
        return (
          sortOrder *
          a.roomNumber.localeCompare(b.roomNumber, undefined, {
            numeric: true,
            sensitivity: 'base',
          })
        );
      }
      if (sortBy === 'rent') {
        return sortOrder * (a.monthlyRent - b.monthlyRent);
      }
      if (sortBy === 'occupancy') {
        return sortOrder * (a.occupiedBeds - b.occupiedBeds);
      }
      if (sortBy === 'createdAt') {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return sortOrder * (timeA - timeB);
      }
      // Default: floor asc, then roomNumber natural compare
      if (a.floor !== b.floor) {
        return a.floor - b.floor;
      }
      return a.roomNumber.localeCompare(b.roomNumber, undefined, {
        numeric: true,
        sensitivity: 'base',
      });
    });

    // Pagination
    if (query?.page) {
      const page = Math.max(1, query.page);
      const limit = Math.max(1, query.limit || 10);
      const total = formattedRooms.length;
      const totalPages = Math.ceil(total / limit);
      const data = formattedRooms.slice((page - 1) * limit, page * limit);

      return {
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    }

    return formattedRooms;
  }

  /**
   * Get single room details with beds and occupancy
   */
  async findOne(id: string, ownerId: string, pgId?: string): Promise<any> {
    const room = await this.roomModel
      .findOne({
        _id: new Types.ObjectId(id),
        ownerId: new Types.ObjectId(ownerId),
      })
      .exec();

    if (!room) {
      throw new NotFoundException('Room not found or access denied');
    }

    if (pgId && room.pgId.toString() !== pgId) {
      throw new NotFoundException('Room not found in specified PG');
    }

    const beds = await this.bedModel
      .find({ roomId: room._id })
      .exec();

    return this.formatRoom(room, beds);
  }

  /**
   * Update room details with bed capacity synchronization
   */
  async update(
    id: string,
    ownerId: string,
    updateRoomDto: UpdateRoomDto,
    pgId?: string,
  ): Promise<any> {
    const room = await this.roomModel
      .findOne({
        _id: new Types.ObjectId(id),
        ownerId: new Types.ObjectId(ownerId),
      })
      .exec();

    if (!room) {
      throw new NotFoundException('Room not found or access denied');
    }

    if (pgId && room.pgId.toString() !== pgId) {
      throw new NotFoundException('Room not found in specified PG');
    }

    // Check duplicate roomNumber if changed
    if (
      updateRoomDto.roomNumber &&
      updateRoomDto.roomNumber.trim() !== room.roomNumber
    ) {
      const existing = await this.roomModel
        .findOne({
          pgId: room.pgId,
          roomNumber: updateRoomDto.roomNumber.trim(),
          _id: { $ne: room._id },
        })
        .collation({ locale: 'en', strength: 2 })
        .exec();

      if (existing) {
        throw new ConflictException('Room number already exists in this PG');
      }
    }

    const newCapacity =
      updateRoomDto.bedCapacity ?? updateRoomDto.sharing;

    // Handle bed capacity change
    if (newCapacity !== undefined && newCapacity !== room.bedCapacity) {
      const existingBeds = await this.bedModel
        .find({ roomId: room._id })
        .sort({ bedNumber: 1 })
        .exec();

      if (newCapacity < existingBeds.length) {
        const bedsToRemoveCount = existingBeds.length - newCapacity;
        const bedsToRemove = existingBeds.slice(-bedsToRemoveCount);

        const hasOccupied = bedsToRemove.some(
          (b) => b.status === BedStatus.OCCUPIED || b.tenantId,
        );
        if (hasOccupied) {
          throw new BadRequestException(
            'Cannot reduce room capacity below occupied or assigned beds',
          );
        }

        const idsToRemove = bedsToRemove.map((b) => b._id);
        await this.bedModel.deleteMany({ _id: { $in: idsToRemove } }).exec();
      } else if (newCapacity > existingBeds.length) {
        const bedsToAddCount = newCapacity - existingBeds.length;
        const currentMaxBedNumber = existingBeds.reduce(
          (max, b) => Math.max(max, b.bedNumber),
          0,
        );

        const newBeds = Array.from({ length: bedsToAddCount }, (_, i) => {
          const bedNum = currentMaxBedNumber + i + 1;
          return {
            roomId: room._id,
            pgId: room.pgId,
            ownerId: room.ownerId,
            bedNumber: bedNum,
            label: getBedLabel(room.roomNumber, bedNum),
            status: BedStatus.AVAILABLE,
            isOccupied: false,
            monthlyRent:
              updateRoomDto.monthlyRent ??
              updateRoomDto.rentPerBed ??
              room.monthlyRent,
          };
        });

        await this.bedModel.insertMany(newBeds);
      }
    }

    const updatePayload: any = {};
    if (updateRoomDto.roomNumber) {
      updatePayload.roomNumber = updateRoomDto.roomNumber.trim();
    }
    if (updateRoomDto.floor !== undefined) {
      updatePayload.floor = updateRoomDto.floor;
    }
    if (updateRoomDto.roomType) {
      updatePayload.roomType = updateRoomDto.roomType;
    }
    if (newCapacity !== undefined) {
      updatePayload.bedCapacity = newCapacity;
      updatePayload.sharing = newCapacity;
    }
    if (updateRoomDto.monthlyRent !== undefined) {
      updatePayload.monthlyRent = updateRoomDto.monthlyRent;
      updatePayload.rentPerBed = updateRoomDto.monthlyRent;
    } else if (updateRoomDto.rentPerBed !== undefined) {
      updatePayload.monthlyRent = updateRoomDto.rentPerBed;
      updatePayload.rentPerBed = updateRoomDto.rentPerBed;
    }
    if (updateRoomDto.securityDeposit !== undefined) {
      updatePayload.securityDeposit = updateRoomDto.securityDeposit;
    }
    if (updateRoomDto.bathroomType) {
      updatePayload.bathroomType = updateRoomDto.bathroomType;
    }
    if (updateRoomDto.furnishing) {
      updatePayload.furnishing = updateRoomDto.furnishing;
    }
    if (updateRoomDto.amenities) {
      updatePayload.amenities = updateRoomDto.amenities;
    }
    if (updateRoomDto.description !== undefined) {
      updatePayload.description = updateRoomDto.description?.trim();
    }

    await this.roomModel
      .updateOne({ _id: room._id }, { $set: updatePayload }, { runValidators: true })
      .exec();

    return this.findOne(id, ownerId, pgId);
  }

  /**
   * Delete room and its beds safely
   */
  async remove(id: string, ownerId: string, pgId?: string): Promise<{ message: string; id: string }> {
    const room = await this.roomModel
      .findOne({
        _id: new Types.ObjectId(id),
        ownerId: new Types.ObjectId(ownerId),
      })
      .exec();

    if (!room) {
      throw new NotFoundException('Room not found or access denied');
    }

    if (pgId && room.pgId.toString() !== pgId) {
      throw new NotFoundException('Room not found in specified PG');
    }

    const occupiedBeds = await this.bedModel.countDocuments({
      roomId: room._id,
      $or: [{ status: BedStatus.OCCUPIED }, { tenantId: { $ne: null } }],
    }).exec();

    if (occupiedBeds > 0) {
      throw new BadRequestException('Cannot delete room with occupied beds');
    }

    await this.bedModel.deleteMany({ roomId: room._id }).exec();
    await this.roomModel.deleteOne({ _id: room._id }).exec();

    return { message: 'Room deleted successfully', id };
  }

  /**
   * Aggregate room and bed occupancy totals for a PG
   */
  async getSummary(pgId: string, ownerId: string): Promise<any> {
    await this.verifyPgOwnership(pgId, ownerId);

    const pgObjectId = new Types.ObjectId(pgId);
    const rooms = await this.roomModel.find({ pgId: pgObjectId }).exec();
    const beds = await this.bedModel.find({ pgId: pgObjectId }).exec();

    const totalRooms = rooms.length;
    const totalBeds = beds.length;
    const occupiedBeds = beds.filter(
      (b) => b.status === BedStatus.OCCUPIED,
    ).length;
    const reservedBeds = beds.filter(
      (b) => b.status === BedStatus.RESERVED,
    ).length;
    const maintenanceBeds = beds.filter(
      (b) => b.status === BedStatus.MAINTENANCE,
    ).length;
    const availableBeds = beds.filter(
      (b) => b.status === BedStatus.AVAILABLE || b.status === BedStatus.VACANT,
    ).length;
    const vacantBeds = availableBeds;

    const occupancyRate =
      totalBeds > 0
        ? Number(((occupiedBeds / totalBeds) * 100).toFixed(1))
        : 0;

    // Group vacant beds by sharing
    const sharingMap = new Map<
      number,
      { sharing: number; totalRooms: number; totalBeds: number; vacantBeds: number; occupiedBeds: number }
    >();

    rooms.forEach((r) => {
      const cap = r.bedCapacity || r.sharing || 1;
      if (!sharingMap.has(cap)) {
        sharingMap.set(cap, {
          sharing: cap,
          totalRooms: 0,
          totalBeds: 0,
          vacantBeds: 0,
          occupiedBeds: 0,
        });
      }
      const entry = sharingMap.get(cap)!;
      entry.totalRooms += 1;
    });

    beds.forEach((b) => {
      const parentRoom = rooms.find(
        (r) => r._id.toString() === b.roomId.toString(),
      );
      const cap = parentRoom ? parentRoom.bedCapacity || parentRoom.sharing || 1 : 1;
      const entry = sharingMap.get(cap);
      if (entry) {
        entry.totalBeds += 1;
        if (b.status === BedStatus.OCCUPIED) {
          entry.occupiedBeds += 1;
        } else if (
          b.status === BedStatus.AVAILABLE ||
          b.status === BedStatus.VACANT
        ) {
          entry.vacantBeds += 1;
        }
      }
    });

    const vacantBySharing = Array.from(sharingMap.values()).sort(
      (a, b) => a.sharing - b.sharing,
    );

    return {
      totalRooms,
      totalBeds,
      occupiedBeds,
      availableBeds,
      vacantBeds,
      reservedBeds,
      maintenanceBeds,
      occupancyRate,
      vacantBySharing,
    };
  }
}
